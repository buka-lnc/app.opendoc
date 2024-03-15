import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ApiDocumentFileCreatedEvent } from '../api-document-file/events/api-document-file-created.event'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { EntityRepository } from '@mikro-orm/mysql'


@Injectable()
export class RegistryListener {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,


    @InjectRepository(ApiDocumentFile)
    private readonly apiDocumentFileRepo: EntityRepository<ApiDocumentFile>,
  ) {}

  @OnEvent('api-document-file.created')
  async handleOrderCreatedEvent(event: ApiDocumentFileCreatedEvent) {
    const apiDocumentFile = await this.apiDocumentFileRepo.findOne({
      id: event.apiDocumentFileId,
    })
    console.log('🚀 ~ RegistryListener ~ handleOrderCreatedEvent ~ apiDocumentFile:', apiDocumentFile)
  }
}
