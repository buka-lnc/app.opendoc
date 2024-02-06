import { EnsureRequestContext, EntityManager, MikroORM, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
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


@Injectable()
export class ApiDocumentService {
  constructor(
    @InjectPinoLogger(ApiDocumentService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

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


  private getFilepath(document: ApiDocument): string {
    return path.join(path.resolve(this.appConfig.storage), document.id)
  }

  private async persistFile(document: ApiDocument, buf: Buffer): Promise<void> {
    const revisionHash = (await import('rev-hash')).default
    const hash = revisionHash(buf)

    if (document.hash === hash) {
      this.logger.info('document hash is same, skip')
      return
    }

    this.logger.info('document hash is different, persisting')

    const filepath = this.getFilepath(document)
    const dir = path.dirname(filepath)

    await fs.ensureDir(dir)
    await fs.writeFile(filepath, buf)

    document.hash = hash
    // TODO: bump document.version
    this.em.persist(document)
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

  async queryDocumentFileById(documentId: string): Promise<fs.ReadStream> {
    const document = await this.em.findOneOrFail(ApiDocument, documentId)
    const filepath = this.getFilepath(document)
    return fs.createReadStream(filepath)
  }
}

