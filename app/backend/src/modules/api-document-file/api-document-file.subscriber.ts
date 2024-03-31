import { Injectable } from '@nestjs/common'
import * as fs from 'fs-extra'
import { EntityManager, EntityName, EventArgs, EventSubscriber, MikroORM } from '@mikro-orm/core'
import { ApiDocumentFile } from './entities/api-document-file.entity'
import { ApiDocumentFileService } from './api-document-file.service'

@Injectable()
export class ApiDocumentFileSubscriber implements EventSubscriber<ApiDocumentFile> {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly apiDocumentFileService: ApiDocumentFileService,
  ) {
    em.getEventManager().registerSubscriber(this)
  }

  getSubscribedEntities(): EntityName<ApiDocumentFile>[] {
    return [ApiDocumentFile]
  }

  async afterDelete(args: EventArgs<ApiDocumentFile>): Promise<void> {
    const entity = args.entity

    const filepath = this.apiDocumentFileService.getFilepath(entity)
    if (await fs.exists(filepath)) {
      await fs.remove(filepath)
    }
  }
}

