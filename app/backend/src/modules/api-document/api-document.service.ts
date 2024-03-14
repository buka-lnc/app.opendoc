import { EnsureRequestContext, EntityManager, MikroORM, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import semver from 'semver'
import * as fs from 'fs-extra'
import { request } from 'keq'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import * as path from 'path'
import { AppConfig } from '~/config/app.config'
import { QueryApiDocumentsDTO } from './dto/query-api-documents.dto'
import { RegisterApiDocumentDTO } from './dto/register-api-document.dto'
import { ApiDocument } from './entities/api-document.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Application } from '../application/entity/application.entity'
import { EntityRepository } from '@mikro-orm/mysql'
import { QueryApiDocumentsResponseDTO } from './dto/query-api-documents-response.dto'
import { ApiDocumentFile } from './entities/api-document-file.entity'


@Injectable()
export class ApiDocumentService {
  constructor(
    @InjectPinoLogger(ApiDocumentService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(ApiDocumentFile)
    private readonly apiDocumentFileRepo: EntityRepository<ApiDocumentFile>,

    @InjectRepository(ApiDocument)
    private readonly apiDocumentRepo: EntityRepository<ApiDocument>,

    @InjectRepository(Application)
    private readonly applicationRepo: EntityRepository<Application>,
  ) {}

  @EnsureRequestContext()
  async register(dto: RegisterApiDocumentDTO): Promise<ApiDocument> {
    const application = await this.applicationRepo.findOneOrFail({
      code: dto.applicationCode,
    })

    let document: ApiDocument

    document = await this.em.findOne(ApiDocument, {
      code: dto.apiDocumentCode,
    })

    if (!document) {
      document = new ApiDocument()
      document.type = dto.apiDocumentType
      document.code = dto.apiDocumentCode
      document.application = wrap(application).toReference()
    }

    if (dto.apiDocumentCronSyncUrl) document.cronSyncUrl = dto.apiDocumentCronSyncUrl
    if (dto.apiDocumentTitle) document.title = dto.apiDocumentTitle
    if (dto.apiDocumentOrder) document.order = dto.apiDocumentOrder
    await this.em.persistAndFlush(document)

    if (dto.apiDocumentFile) await this.persistFile(document, dto.apiDocumentFile)
    await this.em.flush()
    return document
  }


  private getFilepath(file: ApiDocumentFile): string {
    return path.join(path.resolve(this.appConfig.storage), file.id)
  }

  /**
   * @param lastVersion 相同tag的上一个版本
   * @param latestVersion 最新版本
   */
  private bumpVersion(lastVersion: semver.SemVer | null, latestVersion: semver.SemVer | null): string {
    const tag = lastVersion?.prerelease[0]

    if (tag) {
      if (lastVersion.compareMain(latestVersion) === 0) {
        // 如果最新版本和上一个版本是同一个主版本。则直接在上一个版本的基础上将prerelease的数字加1
        // 0.0.1.alpha.5 -> 0.0.1.alpha.6
        return `${lastVersion.major}.${lastVersion.minor}.${lastVersion.patch}-${tag}.${Number(lastVersion.prerelease[1]) + 1}`
      }

      // 如果最新版本和上一个版本不是同一个主版本。则改为最新版本并将prerelease的数字重置为0
      // 0.0.1-alpha.5 -> 0.0.2-alpha.0
      return `${latestVersion.major}.${latestVersion.minor}.${latestVersion.patch}-${tag}.0`
    } else if (latestVersion) {
      // 如果没有tag，则直接在最新版本的基础上将patch的数字加1
      // 0.0.1 -> 0.0.2
      return `${latestVersion.major}.${latestVersion.minor}.${latestVersion.patch + 1}`
    }

    // 如果没有任何版本，则返回0.0.1
    return '0.0.1'
  }

  private async persistFile(document: ApiDocument, buf: Buffer, tag: string = null): Promise<void> {
    const revisionHash = (await import('rev-hash')).default
    const hash = revisionHash(buf)

    const lastVersionFile = await this.apiDocumentFileRepo.findOne(
      { apiDocument: document, tag: tag },
      { orderBy: { id: 'DESC' } },
    )

    if (lastVersionFile?.hash === hash) {
      this.logger.info('document file hash is same to latest, skip')
      return
    }

    this.logger.info('document file hash is different, persisting')

    const latestVersionFile = await this.apiDocumentFileRepo.findOne(
      { apiDocument: document, tag: null },
      { orderBy: { id: 'DESC' } },
    )

    const lastVersion = lastVersionFile && semver.parse(lastVersionFile.version)
    const latestVersion = latestVersionFile && semver.parse(latestVersionFile.version || '0.0.1')

    const version = this.bumpVersion(lastVersion, latestVersion)

    const newFile = this.apiDocumentFileRepo.create({
      apiDocument: document,
      hash,
      tag: tag,
      version,
    })

    await this.em.persistAndFlush(newFile)

    const filepath = this.getFilepath(newFile)
    const dir = path.dirname(filepath)

    await fs.ensureDir(dir)
    await fs.writeFile(filepath, buf)

    this.em.persist(newFile)
  }

  @Cron('0 */10 * * * *')
  @EnsureRequestContext()
  async syncDocuments(): Promise<void> {
    const documents = await this.em.find(
      ApiDocument,
      {
        cronSyncUrl: { $ne: null },
      },
      {
        limit: 10,
        orderBy: { updateAt: 'ASC' },
      }
    )

    for (const document of documents) {
      await this.syncDocument(document)
      const res = await request
        .get(document.cronSyncUrl)
        .option('resolveWithFullResponse')

      const buf = Buffer.from(await res.arrayBuffer())
      await this.persistFile(document, buf)
      await this.em.flush()
    }
  }

  async syncDocument(document: ApiDocument): Promise<void> {
    const res = await request
      .get(document.cronSyncUrl)
      .option('resolveWithFullResponse')

    const buf = Buffer.from(await res.arrayBuffer())
    await this.persistFile(document, buf)
    await this.em.flush()
  }

  async queryDocumentById(documentId: string): Promise<ApiDocument> {
    return this.apiDocumentRepo.findOneOrFail(documentId)
  }

  async queryDocuments(dto: QueryApiDocumentsDTO): Promise<QueryApiDocumentsResponseDTO> {
    const qb = this.apiDocumentRepo.createQueryBuilder('d')
      .select('*')

    if (dto.title) {
      void qb.andWhere({ title: dto.title })
    }

    if (dto.type) {
      void qb.andWhere({ type: dto.type })
    }

    if (dto.limit || dto.offset) {
      void qb.limit(dto.limit || 10).offset(dto.offset || 0)
    }

    const [results, total] = await qb.getResultAndCount()

    return {
      results,
      page: {
        limit: dto.limit || 10,
        offset: dto.offset || 0,
        total,
      },
    }
  }

  async queryDocumentFileById(documentFileId: string): Promise<fs.ReadStream> {
    const documentFile = await this.em.findOneOrFail(ApiDocumentFile, documentFileId)
    const filepath = this.getFilepath(documentFile)
    return fs.createReadStream(filepath)
  }

  // async queryDocumentFileByVersion(apiDocumentId: string, version: string): Promise<fs.ReadStream> {
  //   const apiDocument = this.apiDocumentRepo.getReference(apiDocumentId)
  //   const documentFile = await this.em.findOneOrFail(ApiDocumentFile, {
  //     apiDocument,
  //     version: version,
  //   })
  //   const filepath = this.getFilepath(documentFile)
  //   return fs.createReadStream(filepath)
  // }
}

