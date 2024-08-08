import { Sdk } from '~/modules/sdk/entities/sdk.entity'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EnsureRequestContext, EntityManager } from '@mikro-orm/core'
import { EntityRepository, MikroORM } from '@mikro-orm/mysql'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { InjectRepository } from '@mikro-orm/nestjs'
import { SheetVersion } from '../sheet-version/entities/sheet-version.entity'
import { Sheet } from '../sheet/entities/sheet.entity'
import { Plugin } from '../plugin/entities/plugin.entity'
import { SdkStatus } from './constant/sdk-status'
import { SdkCreatedEvent } from './events/sdk-created.event'
import { SdkUpdatedEvent } from './events/sdk-updated.event'
import { PluginCommandEvent } from '../plugin/events/plugin-command.event'
import { PluginCommandName } from '../plugin/constants/plugin-command-name'


@Injectable()
export class SdkGateway {
  constructor(
    @InjectPinoLogger(SdkGateway.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly eventEmitter: EventEmitter2,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,

    @InjectRepository(Sheet)
    private readonly sheetRepo: EntityRepository<Sheet>,

    @InjectRepository(SheetVersion)
    private readonly sheetVersionRepo: EntityRepository<SheetVersion>,

    @InjectRepository(Plugin)
    private readonly pluginRepo: EntityRepository<Plugin>,
  ) {}

  @OnEvent('plugin.command.create-sdk')
  async onCreateSdk(message: PluginCommandEvent<PluginCommandName.CREATE_SDK>): Promise<void> {
    await this.createSdk(message)
  }

  @EnsureRequestContext()
  async createSdk(message: PluginCommandEvent<PluginCommandName.CREATE_SDK>): Promise<Sdk> {
    const dto = message.data
    const sheet = await this.sheetRepo.findOneOrFail(dto.sheet.id)

    const version = await this.sheetVersionRepo.findOneOrFail({
      major: dto.version.major,
      minor: dto.version.minor,
      patch: dto.version.patch,
      tag: dto.version.tag,
      prerelease: dto.version.prerelease,
    })

    const plugin = await this.pluginRepo.findOneOrFail(dto.plugin.id)


    const sdk = this.sdkRepo.create({
      sheet,
      version,
      plugin: plugin,
      name: dto.name,
      status: SdkStatus.PENDING,
    })

    await this.em.persistAndFlush(sdk)

    this.eventEmitter.emit(
      'sdk.created',
      new SdkCreatedEvent(sdk.id)
    )

    return sdk
  }

  @OnEvent('plugin.command.update-sdk')
  async onUpdateSdk(message: PluginCommandEvent<PluginCommandName.UPDATE_SDK>): Promise<void> {
    await this.updateSdk(message)
  }

  @EnsureRequestContext()
  async updateSdk(message: PluginCommandEvent<PluginCommandName.UPDATE_SDK>): Promise<Sdk> {
    const dto = message.data

    const sdk = await this.sdkRepo.findOneOrFail(dto.id)
    if (dto.status && dto.status !== sdk.status) {
      sdk.status = dto.status

      if (dto.status === SdkStatus.PUBLISHED) {
        sdk.publishedAt = new Date()
      }
    }

    await this.em.persistAndFlush(sdk)

    this.eventEmitter.emit(
      'sdk.updated',
      new SdkUpdatedEvent(sdk)
    )

    return sdk
  }
}
