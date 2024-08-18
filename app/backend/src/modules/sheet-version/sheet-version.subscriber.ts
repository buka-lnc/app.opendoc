import { EntityManager, EntityName, EventArgs, EventSubscriber, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { MikroORM } from '@mikro-orm/mysql'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SheetVersion } from './entities/sheet-version.entity'
import { SheetVersionBumpEvent } from './events/sheet-version-bump.event'


@Injectable()
export class SheetVersionSubscriber implements EventSubscriber<SheetVersion> {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly eventEmitter: EventEmitter2,
  ) {
    em.getEventManager().registerSubscriber(this)
  }

  getSubscribedEntities(): EntityName<SheetVersion>[] {
    return [SheetVersion]
  }

  afterCreate(args: EventArgs<SheetVersion>): void | Promise<void> {
    this.eventEmitter.emit(
      'sheet-version.bump',
      new SheetVersionBumpEvent(wrap(args.entity).serialize())
    )
  }
}

