import * as R from 'ramda'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { PluginService } from './plugin.service'
import { SheetVersionBumpEvent } from '../sheet-version/events/sheet-version-bump.event'
import { PluginEventName } from './constants/plugin-event-name'
import { CreateRequestContext, EntityManager, wrap } from '@mikro-orm/core'
import { EntityRepository, MikroORM } from '@mikro-orm/mysql'
import { SdkCreatedEvent } from '../sdk/events/sdk-created.event'
import { SheetService } from '../sheet/sheet.service'
import { SheetVersionService } from '../sheet-version/sheet-version.service'
import { InjectRepository } from '@mikro-orm/nestjs'
import { SheetVersion } from '../sheet-version/entities/sheet-version.entity'
import { Sheet } from '../sheet/entities/sheet.entity'
import { Sdk } from '../sdk/entities/sdk.entity'
import { SheetCreatedEvent } from '../sheet/events/sheet-created.event'
import { SheetDeletedEvent } from '../sheet/events/sheet-deleted.event'
import { SdkDeletedEvent } from '../sdk/events/sdk-deleted.event'
import { SdkUpdatedEvent } from '../sdk/events/sdk-updated.event'


@Injectable()
export class PluginListener {
  constructor(
    @InjectPinoLogger(PluginListener.name)
    private readonly logger: PinoLogger,


    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly pluginService: PluginService,
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
    const sheetVersion = await this.sheetVersionRepo.findOne(event.sheetVersion.id)
    if (!sheetVersion) {
      this.logger.error('Cannot send sheet-version-bump event to plugin: sheet version not found')
      return
    }

    const sheet = await sheetVersion.sheet.load()
    if (!sheet) {
      this.logger.error('Cannot send sheet-version-bump event to plugin: sheet not found')
      return
    }


    const application = await sheet.application.load()
    if (!application) {
      this.logger.error('Cannot send sheet-version-bump event to plugin: application not found')
      return
    }

    const version = this.sheetVersionService.parse(sheetVersion.string)

    await this.pluginService.broadcast(PluginEventName.SHEET_VERSION_BUMP, {
      sheet: R.omit(['application', 'versions', 'sdks', 'apiFiles', 'pullCrontab'], wrap(sheet).toObject()),
      application: R.omit(['sheets'], wrap(application).toObject()),
      version,
    })
  }

  @OnEvent('sdk.created')
  @CreateRequestContext()
  async onSdkCreated(event: SdkCreatedEvent): Promise<void> {
    const sdk = await this.sdkRepo.findOne(event.sdk.id)
    if (!sdk) {
      this.logger.error('Cannot send sdk-created event to plugin: sdk not found')
      return
    }

    const parsedVersion = this.sheetVersionService.parse(sdk.version)
    const apiFilesRaw = await this.sheetService.getApiFilesRaw(sdk.sheet.id, sdk.version.string)

    await this.pluginService.broadcast(PluginEventName.SDK_CREATED, {
      sdk: {
        ...wrap(sdk).serialize(),
        version: parsedVersion,
      },
      version: parsedVersion,
      apiFilesRaw: apiFilesRaw.toString('base64'),
    })
  }

  @OnEvent('sdk.updated')
  @CreateRequestContext()
  async onSdkUpdated(event: SdkUpdatedEvent): Promise<void> {
    const sdk = await this.sdkRepo.findOne(event.sdk.id)
    if (!sdk) {
      this.logger.error('Cannot send sdk-updated event to plugin: sdk not found')
      return
    }

    const parsedVersion = this.sheetVersionService.parse(sdk.version)

    await this.pluginService.broadcast(PluginEventName.SDK_UPDATED, {
      sdk: {
        ...wrap(sdk).serialize(),
        version: parsedVersion,
      },
      version: parsedVersion,
    })
  }

  @OnEvent('sdk.deleted')
  @CreateRequestContext()
  async onSdkDeleted(event: SdkDeletedEvent): Promise<void> {
    const sdk = await this.sdkRepo.findOne(event.sdk.id)
    if (!sdk) {
      this.logger.error('Cannot send sdk-deleted event to plugin: sdk not found')
      return
    }
    const parsedVersion = this.sheetVersionService.parse(sdk.version)

    await this.pluginService.broadcast(PluginEventName.SDK_DELETED, {
      sdk: {
        ...wrap(sdk).serialize(),
        version: parsedVersion,
      },
      version: parsedVersion,
    })
  }

  @OnEvent('sheet.created')
  @CreateRequestContext()
  async onSheetCreated(event: SheetCreatedEvent): Promise<void> {
    const sheet = await this.sheetRepo.findOne(event.sheet.id)
    if (!sheet) {
      this.logger.error('Cannot send sheet-created event to plugin: sheet not found')
      return
    }
    const application = await sheet.application.load()
    if (!application) {
      this.logger.error('Cannot send sheet-created event to plugin: application not found')
      return
    }

    await this.pluginService.broadcast(PluginEventName.SHEET_CREATED, {
      sheet: wrap(sheet).serialize(),
      application: wrap(application).serialize(),
    })
  }

  @OnEvent('sheet.deleted')
  @CreateRequestContext()
  async onSheetDeleted(event: SheetDeletedEvent): Promise<void> {
    const sheet = await this.sheetRepo.findOne(event.sheet.id)
    if (!sheet) {
      this.logger.error('Cannot send sheet-deleted event to plugin: sheet not found')
      return
    }
    const application = await sheet.application.load()
    if (!application) {
      this.logger.error('Cannot send sheet-deleted event to plugin: application not found')
      return
    }

    await this.pluginService.broadcast(PluginEventName.SHEET_DELETED, {
      sheet: wrap(sheet).serialize(),
      application: wrap(application).serialize(),
    })
  }
}
