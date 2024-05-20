import { CacheService } from './../storage/cache.service'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs-extra'
import * as path from 'path'
import { EntityManager, EntityName, EventArgs, EventSubscriber, MikroORM } from '@mikro-orm/core'
import { ApiFileService } from './api-file.service'
import { ApiFile } from './entities/api-file.entity'

@Injectable()
export class ApiFileSubscriber implements EventSubscriber<ApiFile> {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

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

  async afterDelete(args: EventArgs<ApiFile>): Promise<void> {
    const entity = args.entity

    const filepath = await this.apiFilerService.getFilepath(entity)
    const cacheFilepath = path.join(this.cacheService.directory, filepath)

    await Promise.all([
      this.clean(cacheFilepath),
      this.clean(cacheFilepath),
    ])
  }
}

