import { SheetSynchronizeService } from './sheet-synchronize.service'
import { EntityManager, EntityName, EventSubscriber } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { MikroORM } from '@mikro-orm/mysql'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SheetPullCrontab } from './entities/sheet-pull-crontab.entity'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'


@Injectable()
export class SheetPullCrontabSubscriber implements EventSubscriber<SheetPullCrontab> {
  constructor(
    @InjectPinoLogger(SheetPullCrontabSubscriber.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly eventEmitter: EventEmitter2,
    private readonly sheetSynchronizeService: SheetSynchronizeService
  ) {
    em.getEventManager().registerSubscriber(this)
  }

  getSubscribedEntities(): EntityName<SheetPullCrontab>[] {
    return [SheetPullCrontab]
  }
}

