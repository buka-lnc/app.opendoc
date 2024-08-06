import * as R from 'ramda'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { CompilerService } from './compiler.service'
import { SheetVersionBumpEvent } from '../sheet-version/events/sheet-version-bump.event'
import { CompilerEvent } from './constants/compiler-message-event'
import { EnsureRequestContext, EntityManager, wrap } from '@mikro-orm/core'
import { MikroORM } from '@mikro-orm/mysql'
import { SdkCreatedEvent } from '../sdk/events/sdk-created.event'

@Injectable()
export class CompilerListener {
  constructor(
    @InjectPinoLogger(CompilerListener.name)
    private readonly logger: PinoLogger,


    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly compilerService: CompilerService
  ) {}

  @OnEvent('sheet-version.bump')
  @EnsureRequestContext()
  async onApiFileCreated(event: SheetVersionBumpEvent): Promise<void> {
    const sheet = await event.sheetVersion.sheet.load()
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
      version: R.pick(['major', 'minor', 'patch', 'tag', 'prerelease'], event.sheetVersion),
    })
  }

  @OnEvent('sdk.created')
  @EnsureRequestContext()
  async onSdkCreated(event: SdkCreatedEvent): Promise<void> {
    const sdk = event.sdk
    const compiler = await sdk.compiler.load()
    if (!compiler) {
      this.logger.error('Cannot send sdk-created event to compiler: compiler not found')
      return
    }

    await this.compilerService.unicast(compiler.id, CompilerEvent.SDK_CREATED, {
      sdk: R.omit(['sheet', 'compiler'], wrap(sdk).toObject()),
    })
  }
}
