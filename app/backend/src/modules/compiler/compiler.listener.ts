import * as R from 'ramda'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { CompilerService } from './compiler.service'
import { SheetVersionBumpEvent } from '../sheet-version/events/sheet-version-bump.event'
import { CompilerEvent } from './constants/compiler-message-event'
import { CreateRequestContext, EntityManager, wrap } from '@mikro-orm/core'
import { EntityRepository, MikroORM } from '@mikro-orm/mysql'
import { SdkCreatedEvent } from '../sdk/events/sdk-created.event'
import { SheetService } from '../sheet/sheet.service'
import { SheetVersionService } from '../sheet-version/sheet-version.service'
import { InjectRepository } from '@mikro-orm/nestjs'
import { SheetVersion } from '../sheet-version/entities/sheet-version.entity'
import { Sheet } from '../sheet/entities/sheet.entity'
import { Sdk } from '../sdk/entities/sdk.entity'


@Injectable()
export class CompilerListener {
  constructor(
    @InjectPinoLogger(CompilerListener.name)
    private readonly logger: PinoLogger,


    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly compilerService: CompilerService,
    private readonly sheetService: SheetService,
    private readonly sheetVersionService: SheetVersionService,


    @InjectRepository(SheetVersion)
    private readonly sheetVersionRepo: EntityRepository<SheetVersion>,

    @InjectRepository(Sheet)
    private readonly sheetRepo: EntityRepository<Sheet>,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,
  ) {}

  @OnEvent('sheet-version.bump')
  @CreateRequestContext()
  async onApiFileCreated(event: SheetVersionBumpEvent): Promise<void> {
    const sheetVersion = await this.sheetVersionRepo.findOne(event.sheetVersionId)
    if (!sheetVersion) {
      this.logger.error('Cannot send sheet-version-bump event to compiler: sheet version not found')
      return
    }

    const sheet = await sheetVersion.sheet.load()
    if (!sheet) {
      this.logger.error('Cannot send sheet-version-bump event to compiler: sheet not found')
      return
    }


    const application = await sheet.application.load()
    if (!application) {
      this.logger.error('Cannot send sheet-version-bump event to compiler: application not found')
      return
    }

    await this.compilerService.broadcast(CompilerEvent.SHEET_VERSION_BUMP, {
      sheet: R.omit(['application', 'versions', 'sdks', 'apiFiles', 'pullCrontab'], wrap(sheet).toObject()),
      application: R.omit(['sheets'], wrap(application).toObject()),
      version: R.pick(['major', 'minor', 'patch', 'tag', 'prerelease'], sheetVersion),
    })
  }

  @OnEvent('sdk.created')
  @CreateRequestContext()
  async onSdkCreated(event: SdkCreatedEvent): Promise<void> {
    const sdk = await this.sdkRepo.findOne(event.sdkId)
    if (!sdk) {
      this.logger.error('Cannot send sdk-created event to compiler: sdk not found')
      return
    }

    const parsedVersion = this.sheetVersionService.parse(sdk.version)
    const compiler = await sdk.compiler.load()
    if (!compiler) {
      this.logger.error('Cannot send sdk-created event to compiler: compiler not found')
      return
    }

    const apiFilesRaw = await this.sheetService.getApiFilesRaw(sdk.sheet.id, sdk.version.version)

    await this.compilerService.unicast(compiler.id, CompilerEvent.SDK_CREATED, {
      sdk: {
        ...R.omit(['sheet', 'compiler', 'version'], wrap(sdk).toObject()),
        version: parsedVersion,
      },
      version: parsedVersion,
      apiFilesRaw: apiFilesRaw.toString('base64'),
    })
  }
}
