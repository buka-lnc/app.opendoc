import {
  EntityManager,
  EntityName,
  EventArgs,
  // EventArgs,
  EventSubscriber,
  MikroORM,
  wrap,
} from '@mikro-orm/core'
import { Sdk } from './entities/sdk.entity'
import { SdkService } from './sdk.service'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SdkCreatedEvent } from './events/sdk-created.event'
import { SdkUpdatedEvent } from './events/sdk-updated.event'
import { SdkDeletedEvent } from './events/sdk-deleted.event'


@Injectable()
export class SdkSubscriber implements EventSubscriber<Sdk> {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly eventEmitter: EventEmitter2,
    private readonly sdkService: SdkService,
  ) {
    em.getEventManager().registerSubscriber(this)
  }

  getSubscribedEntities(): EntityName<Sdk>[] {
    return [Sdk]
  }

  afterCreate(args: EventArgs<Sdk>): void | Promise<void> {
    this.eventEmitter.emit(
      'sdk.created',
      new SdkCreatedEvent(wrap(args.entity).serialize())
    )
  }

  afterUpdate(args: EventArgs<Sdk>): void | Promise<void> {
    this.eventEmitter.emit(
      'sdk.updated',
      new SdkUpdatedEvent(wrap(args.entity).serialize())
    )
  }


  afterDelete(args: EventArgs<Sdk>): void | Promise<void> {
    this.eventEmitter.emit(
      'sdk.deleted',
      new SdkDeletedEvent(wrap(args.entity).serialize())
    )
  }
}
