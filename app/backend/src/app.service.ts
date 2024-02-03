import { EnsureRequestContext, EntityManager, MikroORM } from '@mikro-orm/core'
import * as fs from 'fs-extra'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'
import { API_DOCUMENT_TYPE } from './modules/api-document/constants/api-document-type.enum'
import { ApiDocumentService } from './modules/api-document/api-document.service'
import { Folder } from './modules/folder/entities/folder.entity'
import { FolderService } from './modules/folder/folder.service'
import { AppConfig } from './config/app.config'
import { OpenAPIObject } from '@nestjs/swagger'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly appConfig: AppConfig,

    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private health: HealthCheckService,

    private readonly folderService: FolderService,
    private readonly apiDocumentService: ApiDocumentService,
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
    const root = await this.em.findOne(Folder, { mpath: 'opendoc/' })
    if (!root) {
      await this.folderService.register({
        mpath: 'opendoc/',
        title: 'OpenDoc',
      })
    }

    await this.em.flush()
  }

  @EnsureRequestContext()
  async registerOpenDocDocuments(openapi: OpenAPIObject) {
    const buf = await fs.readFile('README.md')
    await this.apiDocumentService.register({
      type: API_DOCUMENT_TYPE.README,
      code: 'readme',
      order: 1,
      title: 'README',
      folderMpath: 'opendoc',
      file: buf,
    })

    await this.apiDocumentService.register({
      type: API_DOCUMENT_TYPE.OPEN_API,
      code: 'openapi',
      title: 'OpenAPI',
      order: 2,
      folderMpath: 'opendoc',
      cronSyncUrl: `http://${this.appConfig.host}:${this.appConfig.port}/swagger`,
      file: Buffer.from(JSON.stringify(openapi), 'utf-8'),
    })
  }
}
