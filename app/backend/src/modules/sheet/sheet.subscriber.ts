import { EntityManager, EntityName, EventArgs, EventSubscriber, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { Sheet } from './entities/sheet.entity'
import { MikroORM } from '@mikro-orm/mysql'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SheetCreatedEvent } from './events/sheet-created.event'
import { SheetDeletedEvent } from './events/sheet-deleted.event'


@Injectable()
export class SheetSubscriber implements EventSubscriber<Sheet> {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly eventEmitter: EventEmitter2,
  ) {
    em.getEventManager().registerSubscriber(this)
  }

  getSubscribedEntities(): EntityName<Sheet>[] {
    return [Sheet]
  }

  afterCreate(args: EventArgs<Sheet>): void | Promise<void> {
    this.eventEmitter.emit(
      'sheet.created',
      new SheetCreatedEvent(wrap(args.entity).serialize())
    )
  }

  afterDelete(args: EventArgs<Sheet>): void | Promise<void> {
    this.eventEmitter.emit(
      'sheet.deleted',
      new SheetDeletedEvent(wrap(args.entity).serialize())
    )
  }
}
