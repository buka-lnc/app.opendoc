import { EntityManager, MikroORM } from '@mikro-orm/core'
import semver from 'semver'
import * as path from 'path'
import * as fs from 'fs-extra'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ApiDocumentFile } from './entities/api-document-file.entity'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { QueryApiDocumentFilesDTO } from './dto/query-api-document-files.dto'
import { CreateApiDocumentFileDTO } from './dto/create-api-document-file.dto'
import { ApiDocument } from '../api-document/entities/api-document.entity'
import { AppConfig } from '~/config/app.config'


@Injectable()
export class ApiDocumentFileService {
  constructor(
    @InjectPinoLogger(ApiDocumentFileService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(ApiDocument)
    private readonly apiDocumentRepo: EntityRepository<ApiDocumentFile>,

    @InjectRepository(ApiDocumentFile)
    private readonly apiDocumentFileRepo: EntityRepository<ApiDocumentFile>,
  ) {}

  /**
   * @param tag tag
   * @param lastVersion 相同tag的上一个版本
   * @param latestVersion 最新版本
   */
  private bumpVersion(tag: string | undefined, lastVersion: semver.SemVer | null, latestVersion: semver.SemVer | null): string {
    if (tag) {
      if (lastVersion && latestVersion && lastVersion.compareMain(latestVersion) === 0) {
        // 0.0.1.alpha.5 -> 0.0.1.alpha.6
        return `${lastVersion.major}.${lastVersion.minor}.${lastVersion.patch}-${tag}.${Number(lastVersion.prerelease[1]) + 1}`
      } else if (lastVersion && !latestVersion) {
        // 0.0.1.alpha.5 -> 0.0.1.alpha.6
        return `${lastVersion.major}.${lastVersion.minor}.${lastVersion.patch}-${tag}.${Number(lastVersion.prerelease[1]) + 1}`
      } else if (!latestVersion) {
        // null -> 0.0.1-alpha.0
        return `0.0.1-${tag}.0`
      }

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

  private getFilepath(file: ApiDocumentFile): string {
    return path.join(path.resolve(this.appConfig.storage), file.apiDocument.id, file.version)
  }

  async create(dto: CreateApiDocumentFileDTO): Promise<ApiDocumentFile> {
    const tag = dto.tag === 'latest' ? undefined : dto.tag

    const revisionHash = (await import('rev-hash')).default
    const hash = revisionHash(dto.file)

    const lastVersionFile = await this.apiDocumentFileRepo.findOne(
      { apiDocument: dto.apiDocumentId, tag },
      { orderBy: { id: 'DESC' } },
    )

    if (lastVersionFile?.hash === hash) {
      this.logger.info('document file hash is same to latest, skip')
      return lastVersionFile
    }

    this.logger.info('document file hash is different, persisting')

    const latestVersionFile = await this.apiDocumentFileRepo.findOne(
      { apiDocument: dto.apiDocumentId, tag: null },
      { orderBy: { id: 'DESC' } },
    )

    const lastVersion = lastVersionFile && semver.parse(lastVersionFile.version)
    const latestVersion = latestVersionFile && semver.parse(latestVersionFile.version || '0.0.1')

    const version = this.bumpVersion(tag, lastVersion, latestVersion)

    const newFile = this.apiDocumentFileRepo.create({
      apiDocument: dto.apiDocumentId,
      hash,
      tag,
      version,
    })

    const filepath = this.getFilepath(newFile)
    const dir = path.dirname(filepath)

    await fs.ensureDir(dir)
    await fs.writeFile(filepath, dto.file)

    this.em.persist(newFile)
    return newFile
  }

  async queryApiDocumentFiles(dto: QueryApiDocumentFilesDTO): Promise<ApiDocumentFile[]> {
    const qb = this.apiDocumentFileRepo.createQueryBuilder('file')

    if (dto.apiDocumentIds) {
      void qb.andWhere({ apiDocument: { id: { $in: dto.apiDocumentIds } } })
    }

    if (dto.tags) {
      void qb.andWhere({ tags: { $in: dto.tags } })
    }

    return qb.getResultList()
  }

  async queryRawDocumentFileById(documentFileId: string): Promise<fs.ReadStream> {
    const documentFile = await this.em.findOneOrFail(ApiDocumentFile, documentFileId)
    const filepath = this.getFilepath(documentFile)
    return fs.createReadStream(filepath)
  }

  async queryRawDocumentFileByVersion(apiDocumentId: string, version: string): Promise<fs.ReadStream> {
    const apiDocument = this.apiDocumentRepo.getReference(apiDocumentId)
    const documentFile = await this.em.findOneOrFail(ApiDocumentFile, {
      apiDocument,
      version: version === 'latest' ? null : version,
    })
    console.log('🚀 ~ ApiDocumentFileService ~ queryRawDocumentFileByVersion ~ documentFile:', documentFile)
    const filepath = this.getFilepath(documentFile)
    return fs.createReadStream(filepath)
  }

  async queryDocumentFileByVersion(apiDocumentId: string, version: string): Promise<ApiDocumentFile> {
    const apiDocument = this.apiDocumentRepo.getReference(apiDocumentId)
    const documentFile = await this.em.findOneOrFail(ApiDocumentFile, {
      apiDocument,
      version,
    })

    return documentFile
  }

  async queryDocumentFileByTag(apiDocumentId: string, tag: string | undefined): Promise<ApiDocumentFile> {
    const apiDocument = this.apiDocumentRepo.getReference(apiDocumentId)
    const documentFile = await this.apiDocumentFileRepo.findOneOrFail(
      {
        apiDocument,
        tag: tag === 'latest' ? null : tag,
      },
      {
        orderBy: { id: 'DESC' },
      }
    )

    return documentFile
  }
}
