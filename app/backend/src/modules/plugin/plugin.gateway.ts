import { PluginLogService } from './plugin-log.service'
import { PluginCommandEvent } from './events/plugin-command.event'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EnsureRequestContext, EntityManager } from '@mikro-orm/core'
import { MikroORM } from '@mikro-orm/mysql'
import { PluginService } from './plugin.service'
import { PluginCommandName } from './constants/plugin-command-name'
import { pe } from '~/utils/pe'
import { Plugin } from './entities/plugin.entity'


@Injectable()
export class PluginGateway {
  constructor(
    @InjectPinoLogger(PluginGateway.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly pluginService: PluginService,
    private readonly pluginLogService: PluginLogService,
  ) {}

  @OnEvent('plugin.command.join')
  async onJoin(message: PluginCommandEvent<PluginCommandName.JOIN>) {
    await this.updatePluginMetadata(message)
  }

  @EnsureRequestContext()
  async updatePluginMetadata(message: PluginCommandEvent<PluginCommandName.JOIN>) {
    try {
      await this.pluginService.updateMetadata(message.plugin.id, message.data)
    } catch (err) {
      this.logger.error(`plugin.command.join failed: ${pe(err)}`)
    }
  }

  @OnEvent('plugin.command.log')
  async onLog(message: PluginCommandEvent<PluginCommandName.LOG>) {
    await this.appendLogs(message)
  }

  @EnsureRequestContext()
  async appendLogs(message: PluginCommandEvent<PluginCommandName.LOG>) {
    try {
      const plugin = this.em.getReference(Plugin, message.plugin.id)
      await this.pluginLogService.append(plugin, message.data.message)
    } catch (err) {
      this.logger.error(`plugin.command.log failed: ${pe(err)}`)
    }
  }
}
