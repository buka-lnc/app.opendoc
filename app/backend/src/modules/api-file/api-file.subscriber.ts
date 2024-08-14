import { CacheService } from './../storage/cache.service'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs-extra'
import * as path from 'path'
import { EntityManager, EntityName, EventArgs, EventSubscriber, MikroORM, wrap } from '@mikro-orm/core'
import { ApiFileService } from './api-file.service'
import { ApiFile } from './entities/api-file.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApiFileCreatedEvent } from './events/api-file-created.event'

@Injectable()
export class ApiFileSubscriber implements EventSubscriber<ApiFile> {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly eventEmitter: EventEmitter2,
    private readonly apiFilerService: ApiFileService,
    private readonly cacheService: CacheService,
  ) {
    em.getEventManager().registerSubscriber(this)
  }

  getSubscribedEntities(): EntityName<ApiFile>[] {
    return [ApiFile]
  }

  private async clean(filepath: string): Promise<void> {
    if (await fs.exists(filepath)) {
      await fs.remove(filepath)
    }
  }

  afterCreate(args: EventArgs<ApiFile>): void | Promise<void> {
    this.eventEmitter.emit(
      'api-file.created',
      new ApiFileCreatedEvent(wrap(args.entity).serialize())
    )
  }


  async afterDelete(args: EventArgs<ApiFile>): Promise<void> {
    const entity = args.entity

    this.eventEmitter.emit(
      'api-file.deleted',
      new ApiFileCreatedEvent(wrap(entity).serialize())
    )

    const filepath = await this.apiFilerService.getFilepath(entity)
    const cacheFilepath = path.join(this.cacheService.directory, filepath)

    await Promise.all([
      this.clean(cacheFilepath),
      this.clean(cacheFilepath),
    ])
  }
}

