import { ApiFileStorageService } from './api-file-storage.service'
import { Injectable } from '@nestjs/common'
import { EntityManager, EntityName, EventArgs, EventSubscriber, MikroORM, wrap } from '@mikro-orm/core'
import { ApiFile } from './entities/api-file.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApiFileCreatedEvent } from './events/api-file-created.event'

@Injectable()
export class ApiFileSubscriber implements EventSubscriber<ApiFile> {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly eventEmitter: EventEmitter2,
    private readonly apiFileStorageService: ApiFileStorageService,

  ) {
    em.getEventManager().registerSubscriber(this)
  }

  getSubscribedEntities(): EntityName<ApiFile>[] {
    return [ApiFile]
  }

  beforeCreate(args: EventArgs<ApiFile>): void | Promise<void> {
    const entity = args.entity
    if (!entity.raw) {
      throw new Error('ApiFile.__raw__ must be set before creating')
    }
  }

  async afterCreate(args: EventArgs<ApiFile>): Promise<void> {
    const entity = args.entity
    await this.apiFileStorageService.flush(entity)

    this.eventEmitter.emit(
      'api-file.created',
      new ApiFileCreatedEvent(wrap(entity).serialize())
    )
  }

  async afterDelete(args: EventArgs<ApiFile>): Promise<void> {
    const entity = args.entity

    this.eventEmitter.emit(
      'api-file.deleted',
      new ApiFileCreatedEvent(wrap(entity).serialize())
    )

    await this.apiFileStorageService.removeFile(entity)
  }
}

