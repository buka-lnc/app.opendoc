import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ApiDocumentFileCreatedEvent } from '../api-document-file/events/api-document-file-created.event'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { API_DOCUMENT_TYPE } from '../api-document/constants/api-document-type.enum'
import { Sdk } from './entity/sdk.entity'
import { SdkStatus } from './constant/sdk-status'
import { SdkCompiler } from './constant/sdk-compiler'


@Injectable()
export class SdkListener {
  constructor(
    @InjectPinoLogger(SdkListener.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,


    @InjectRepository(ApiDocumentFile)
    private readonly apiDocumentFileRepo: EntityRepository<ApiDocumentFile>,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,
  ) {}

  @OnEvent('api-document-file.created')
  async createSdk(event: ApiDocumentFileCreatedEvent) {
    const apiDocumentFile = await this.apiDocumentFileRepo.findOne({
      id: event.apiDocumentFile.id,
    }, {
      populate: ['apiDocument', 'apiDocument.application'],
    })

    if (!apiDocumentFile) {
      this.logger.error(`apiDocumentFile(id: ${event.apiDocumentFile.id}) not found`)
      return
    }

    const apiDocument = apiDocumentFile.apiDocument.get()
    const application = apiDocument.application.get()

    if (
      apiDocument.type !== API_DOCUMENT_TYPE.OPEN_API &&
      apiDocument.type !== API_DOCUMENT_TYPE.ASYNC_API
    ) {
      // 其他类型不支持发布到 npm
      return
    }

    const core = this.sdkRepo.create({
      scope: application.code,
      name: apiDocument.code,
      compiler: SdkCompiler.openapiCore,
      version: apiDocumentFile.version,
      tag: apiDocumentFile.tag,
      status: SdkStatus.pending,
      apiDocumentFile: apiDocumentFile.id,
      apiDocument: apiDocument.id,
    })
    this.em.persist(core)

    const react = this.sdkRepo.create({
      scope: application.code,
      name: `${apiDocument.code}.react`,
      compiler: SdkCompiler.openapiReact,
      version: apiDocumentFile.version,
      tag: apiDocumentFile.tag,
      status: SdkStatus.pending,
      apiDocumentFile: apiDocumentFile.id,
      apiDocument: apiDocument.id,
    })
    this.em.persist(react)

    // const vue = this.sdkRepo.create({
    //   scope: application.code,
    //   name: `${apiDocument.code}.vue`,
    //   compiler: SdkCompiler.openapiVue,
    //   version: apiDocumentFile.version,
    //   tag: apiDocumentFile.tag,
    //   status: SdkStatus.pending,
    //   apiDocumentFile: apiDocumentFile.id,
    //   apiDocument: apiDocument.id,
    // })
    // this.em.persist(vue)

    await this.em.flush()
  }
}
