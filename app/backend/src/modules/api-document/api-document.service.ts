import { EnsureRequestContext, EntityManager, MikroORM, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { request } from 'keq'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from '~/config/app.config'
import { QueryApiDocumentsDTO } from './dto/query-api-documents.dto'
import { RegisterApiDocumentDTO } from './dto/register-api-document.dto'
import { ApiDocument } from './entities/api-document.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Application } from '../application/entity/application.entity'
import { EntityRepository } from '@mikro-orm/mysql'
import { QueryApiDocumentsResponseDTO } from './dto/query-api-documents-response.dto'
import { ApiDocumentFileService } from '../api-document-file/api-document-file.service'
import { Sdk } from '../sdk/entity/sdk.entity'
import { CreateApiDocumentDTO } from './dto/create-api-document.dto'
import { ApiDocumentMode } from './constants/api-document-mode.enum'


@Injectable()
export class ApiDocumentService {
  constructor(
    @InjectPinoLogger(ApiDocumentService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly apiDocumentFileService: ApiDocumentFileService,

    @InjectRepository(ApiDocument)
    private readonly apiDocumentRepo: EntityRepository<ApiDocument>,

    @InjectRepository(Application)
    private readonly applicationRepo: EntityRepository<Application>,
  ) {}

  @EnsureRequestContext()
  async register(dto: RegisterApiDocumentDTO): Promise<ApiDocument> {
    const document = await this.create(dto)

    if (dto.apiDocumentFile) {
      await this.apiDocumentFileService.create({
        apiDocumentId: document.id,
        file: dto.apiDocumentFile,
        tag: dto.apiDocumentFileTag,
      })
    }

    return document
  }

  async create(dto: CreateApiDocumentDTO): Promise<ApiDocument> {
    const application = await this.applicationRepo.findOneOrFail({
      code: dto.applicationCode,
    })

    let document: ApiDocument | null

    document = await this.em.findOne(ApiDocument, {
      code: dto.apiDocumentCode,
    })

    if (!document) {
      document = new ApiDocument()
      document.type = dto.apiDocumentType
      document.code = dto.apiDocumentCode
      document.application = wrap(application).toReference()
      document.mode = dto.apiDocumentMode || ApiDocumentMode.PUSH
    }

    if (dto.apiDocumentCronSyncUrl) document.cronSyncUrl = dto.apiDocumentCronSyncUrl
    if (dto.apiDocumentTitle) document.title = dto.apiDocumentTitle
    if (dto.apiDocumentOrder) document.order = dto.apiDocumentOrder
    await this.em.persistAndFlush(document)

    await this.syncDocument(document)

    return document
  }

  async deleteApiDocument(apiDocumentId: string) {
    const apiDocument = await this.apiDocumentRepo.find(
      { id: apiDocumentId },
      {
        populate: [
          'apiDocumentFiles',
          'apiDocumentFiles.sdk',
          'apiDocumentFiles.sdk.sdkPublishLock',
        ],
      }
    )

    if (!apiDocument) return
    await this.em.removeAndFlush(apiDocument)
  }


  @Cron('0 */10 * * * *')
  @EnsureRequestContext()
  async syncDocuments(): Promise<void> {
    const documents = await this.em.find(
      ApiDocument,
      {
        mode: ApiDocumentMode.PULL,
        cronSyncUrl: { $ne: null },
      },
      {
        limit: 10,
        orderBy: { updatedAt: 'ASC' },
      }
    )

    for (const document of documents) {
      await this.syncDocument(document)
    }
    await this.em.flush()
  }

  async syncDocument(document: ApiDocument): Promise<void> {
    if (document.mode !== ApiDocumentMode.PULL) return
    if (!document.cronSyncUrl) return

    const res = await request
      .get(document.cronSyncUrl)
      .option('resolveWithFullResponse')

    const buf = Buffer.from(await res.arrayBuffer())

    await this.apiDocumentFileService.create({
      apiDocumentId: document.id,
      file: buf,
      tag: undefined,
    })
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

  async querySdkByApiDocumentId(documentId: string): Promise<Sdk[]> {
    const document = await this.apiDocumentRepo.findOneOrFail(
      {
        id: documentId,
      },
      { populate: ['sdks'] }
    )

    return document.sdks.getItems()
  }
}

