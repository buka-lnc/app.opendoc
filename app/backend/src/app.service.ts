import { EnsureRequestContext, EntityManager, MikroORM } from '@mikro-orm/core'
import * as fs from 'fs-extra'
import compressing from 'compressing'
import { Injectable } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'
import { API_DOCUMENT_TYPE } from './modules/api-document/constants/api-document-type.enum'
import { ApiDocumentService } from './modules/api-document/api-document.service'
import { AppConfig } from './config/app.config'
import { OpenAPIObject } from '@nestjs/swagger'
import { ApplicationService } from './modules/application/application.service'

@Injectable()
export class AppService {
  constructor(
    private readonly appConfig: AppConfig,

    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private health: HealthCheckService,

    private readonly applicationService: ApplicationService,
    private readonly apiDocumentService: ApiDocumentService,
  ) {}

  checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([])
  }

  @EnsureRequestContext()
  async registerApplication() {
    await this.applicationService.register({
      code: 'opendoc',
      title: 'OpenDoc',
    })
    await this.em.flush()
  }

  private async compress(buffer: Buffer): Promise<Buffer> {
    const { temporaryFile } = await import('tempy')
    const tempFile = temporaryFile({ extension: 'tgz' })
    await compressing.tgz.compressFile(buffer, tempFile, { relativePath: '.root' })
    return await fs.readFile(tempFile)
  }

  @EnsureRequestContext()
  async registerOpenDocDocuments(openapi: OpenAPIObject) {
    const buf = await fs.readFile('README.md')

    await this.apiDocumentService.register({
      applicationCode: 'opendoc',
      apiDocumentType: API_DOCUMENT_TYPE.MARKDOWN,
      apiDocumentCode: 'readme',
      apiDocumentOrder: 1,
      apiDocumentTitle: 'README',
      apiDocumentFile: await this.compress(buf),
    })

    await this.apiDocumentService.register({
      applicationCode: 'opendoc',
      apiDocumentType: API_DOCUMENT_TYPE.OPEN_API,
      apiDocumentCode: 'openapi',
      apiDocumentTitle: 'OpenAPI',
      apiDocumentOrder: 2,
      apiDocumentFile: await this.compress(Buffer.from(JSON.stringify(openapi), 'utf-8')),
    })
  }
}
