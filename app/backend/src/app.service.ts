import { EnsureRequestContext, EntityManager, MikroORM } from '@mikro-orm/core'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'
import { Folder } from './modules/folder/entities/folder.entity'
import { FolderService } from './modules/folder/folder.service'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private health: HealthCheckService,

    private readonly folderService: FolderService,
  ) {}

  checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([])
  }

  async onModuleInit() {
    await this.orm.schema.refreshDatabase()
    await this.initRootFolder()
  }

  @EnsureRequestContext()
  async initRootFolder() {
    const root = await this.em.findOne(Folder, { mpath: 'opendoc' })
    if(!root) {
      await this.folderService.register({
        mpath: 'opendoc',
        title: 'OpenDoc'
      })
    }

    await this.em.flush()
  }
}
