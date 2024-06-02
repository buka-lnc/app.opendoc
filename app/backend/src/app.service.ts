import { EnsureRequestContext, EntityManager, MikroORM } from '@mikro-orm/core'
import * as path from 'path'
import * as fs from 'fs-extra'
import compressing from 'compressing'
import { Injectable } from '@nestjs/common'
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus'
import { AppConfig } from './config/app.config'
import { OpenAPIObject } from '@nestjs/swagger'
import { ApplicationService } from './modules/application/application.service'
import { SheetService } from './modules/sheet/sheet.service'
import { SheetType } from './modules/sheet/constants/sheet-type.enum'
import { ApiFileService } from './modules/api-file/api-file.service'


@Injectable()
export class AppService {
  constructor(
    private readonly appConfig: AppConfig,

    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private health: HealthCheckService,

    private readonly applicationService: ApplicationService,
    private readonly sheetService: SheetService,
    private readonly apiFileService: ApiFileService,
  ) {}

  checkHealth(): Promise<HealthCheckResult> {
    return this.health.check([])
  }

  private async registerApplication() {
    await this.applicationService.register({
      code: 'opendoc',
      title: 'OpenDoc',
    })
    await this.em.flush()
  }

  async registerDocs() {
    const docsDir = path.join(process.cwd(), '../../docs')

    const tgzStream = new compressing.tgz.Stream()
    tgzStream.addEntry(docsDir, { ignoreBase: true })

    const { getStreamAsBuffer } = (await import('get-stream'))
    const buf = await getStreamAsBuffer(tgzStream)

    await this.sheetService.register({
      applicationCode: 'opendoc',
      sheetType: SheetType.MARKDOWN,
      sheetCode: 'docs',
      sheetTitle: 'Docs',
      sheetOrder: 1,
      apiFileRaw: buf,
    })
  }

  async registerOpenapi(openapi: OpenAPIObject) {
    const { temporaryFile } = await import('tempy')

    const openapiBuf = Buffer.from(JSON.stringify(openapi), 'utf-8')

    const tempFile = temporaryFile({ extension: 'tgz' })
    await compressing.tgz.compressFile(openapiBuf, tempFile, { relativePath: 'openapi.json' })
    const apiFileRaw = await fs.readFile(tempFile)

    await this.sheetService.register({
      applicationCode: 'opendoc',
      sheetType: SheetType.OPEN_API,
      sheetCode: 'openapi',
      sheetTitle: 'OpenAPI',
      sheetOrder: 2,
      apiFileRaw,
    })
  }

  @EnsureRequestContext()
  async registerOpendoc(openapi: OpenAPIObject) {
    await this.registerApplication()
    await this.registerDocs()
    await this.registerOpenapi(openapi)
  }
}
