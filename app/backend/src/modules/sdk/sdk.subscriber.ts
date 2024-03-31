import { EntityManager, EntityName, EventArgs, EventSubscriber, MikroORM } from '@mikro-orm/core'
import * as fs from 'fs-extra'
import { Sdk } from './entity/sdk.entity'
import { SdkService } from './sdk.service'
import { Injectable } from '@nestjs/common'


@Injectable()
export class SdkSubscriber implements EventSubscriber<Sdk> {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly sdkService: SdkService,
  ) {
    em.getEventManager().registerSubscriber(this)
  }

  getSubscribedEntities(): EntityName<Sdk>[] {
    return [Sdk]
  }

  async afterDelete(args: EventArgs<Sdk>): Promise<void> {
    const entity = args.entity

    const filepath = this.sdkService.getTarballFilepath(entity)
    if (await fs.exists(filepath)) {
      await fs.remove(filepath)
    }
  }
}
