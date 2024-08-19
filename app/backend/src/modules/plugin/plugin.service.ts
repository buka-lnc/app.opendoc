import * as R from 'ramda'
import * as semver from 'semver'
import { EnsureRequestContext, EntityManager, wrap } from '@mikro-orm/core'
import { EntityRepository, MikroORM } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { Plugin } from './entities/plugin.entity'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import WebSocket from 'ws'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ResponseOfQueryPluginsDTO } from './dto/response-of-query-plugins.dto'
import { QueryPluginsDTO } from './dto/query-plugins.dto'
import { CreatePluginDTO } from './dto/create-plugin.dto'
import { UpdatePluginDTO } from './dto/update-plugin.dto'
import { WebSocketService } from './web-socket.service'
import { PluginEventName } from './constants/plugin-event-name'
import { Cron } from '@nestjs/schedule'
import { PluginOption } from './entities/plugin-option.entity'
import { PluginStatus } from './constants/plugin-status'
import { version as OPENDOC_VERSION } from '~~/package.json'
import { PluginCommandEvent } from './events/plugin-command.event'
import { PluginCommandMessage } from './dto/plugin-command-message.dto'
import { PluginMetadata } from './dto/plugin-command-message/plugin-metadata.dto'
import { PluginEventMessageDataMap } from './types/plugin-event-message-data-map'
import { PluginConfig } from '~/config/plugin.config'


@Injectable()
export class PluginService implements OnModuleInit, OnApplicationShutdown {
  private readonly webSocketMap = new Map<string, WebSocket>()

  constructor(
    @InjectPinoLogger(PluginService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly pluginConfig: PluginConfig,
    private readonly eventEmitter: EventEmitter2,
    private readonly webSocketService: WebSocketService,

    @InjectRepository(Plugin)
    private readonly pluginRepo: EntityRepository<Plugin>,

    @InjectRepository(PluginOption)
    private readonly pluginOptionRepo: EntityRepository<PluginOption>,
  ) {}

  async onModuleInit() {
    await this.consistency()
  }

  /**
   * 定时检查
   * 数据库的编译器记录与当前连接的编译器是否一致
   * 若不一致，则恢复成数据库记录的状态
   */
  @Cron('*/10 * * * * *')
  @EnsureRequestContext()
  private async consistency() {
    const plugins = await this.pluginRepo.find({
      status: PluginStatus.ENABLED,
    })

    for (const plugin of plugins) {
      if (!this.webSocketMap.has(plugin.id)) {
        await this.connectPlugin(plugin)
      }
    }

    await this.em.flush()

    const pluginIds = [...this.webSocketMap.keys()]
    const removedPluginIds = R.difference(pluginIds, R.pluck('id', plugins))

    for (const pluginId of removedPluginIds) {
      const ws = this.webSocketMap.get(pluginId)
      if (ws) ws.close()
    }
  }

  onApplicationShutdown() {
    for (const ws of this.webSocketMap.values()) {
      ws.close()
    }
  }

  async connectPlugin(plugin: Plugin): Promise<void> {
    for (let i = 0; i < 3; i++) {
      try {
        const [ws] = await this.webSocketService.connect(plugin.url)

        ws.on('error', (err) => this.logger.error(err))
        ws.on('close', () => this.webSocketMap.delete(plugin.id))
        ws.on('message', (data: Buffer) => {
          const message: PluginCommandMessage = JSON.parse(data.toString())

          this.logger.debug(`!!!!!!! plugin.command.${message.command} !!!!!!!`,)
          this.eventEmitter.emit(
            `plugin.command.${message.command}`,
            new PluginCommandEvent(
              wrap(plugin).serialize(),
              message.command,
              message.data
            )
          )
        })

        this.webSocketMap.set(plugin.id, ws)

        break
      } catch (e) {
        plugin.status = PluginStatus.BREAKDOWN
        this.logger.error(`Cannot connect to plugin: ${plugin.url}`)
      }
    }
  }

  async queryAll(dto: QueryPluginsDTO): Promise<ResponseOfQueryPluginsDTO> {
    const qb = this.pluginRepo.createQueryBuilder('plugin')
      .leftJoinAndSelect('plugin.options', 'options')
      .orderBy({ options: { order: 'ASC' } })

    if (!R.isNil(dto.offset)) {
      void qb
        .limit(dto.limit || 10)
        .offset(dto.offset || 0)
    }

    const [results, total] = await qb.getResultAndCount()

    return {
      results,
      pagination: {
        total,
        offset: dto.offset || 0,
        limit: dto.limit || 10,
      },
    }
  }

  async queryById(pluginId: string): Promise<Plugin> {
    return await this.pluginRepo.findOneOrFail(pluginId)
  }

  validateApiVersion(apiVersion: string): void {
    if (!semver.satisfies(OPENDOC_VERSION, apiVersion)) {
      throw new BadRequestException(`编译器需要 OpenDoc 版本 ${apiVersion}，但是当前的 OpenDoc 版本是 ${OPENDOC_VERSION}，不兼容。`)
    }
  }

  async create(dto: CreatePluginDTO): Promise<Plugin> {
    const exist = await this.pluginRepo.findOne({
      url: dto.url,
    })
    if (exist) throw new BadRequestException('请勿重复添加')

    const [ws, pluginMetadata] = await this.webSocketService.connect(dto.url)
      .catch((err) => {
        throw new BadRequestException(`无法连接插件：${err.message}`)
      })
    ws.close()

    this.validateApiVersion(pluginMetadata.apiVersion)

    const plugin = this.pluginRepo.create({
      url: dto.url,
      status: PluginStatus.DISABLED,
      name: pluginMetadata.name,
      description: pluginMetadata.description,
      author: pluginMetadata.author,
      version: pluginMetadata.version,
      options: [],
    })

    if (pluginMetadata.options) {
      plugin.options.set(pluginMetadata.options.map((option, index) => this.pluginOptionRepo.create({
        key: option.key,
        label: option.label || option.key,
        order: index + 1,
        description: option.description || '',
        format: option.format,
        value: option.value,
        plugin: plugin,
      })))
    }

    await this.em.persistAndFlush(plugin)
    return plugin
  }

  async update(pluginId: string, dto: UpdatePluginDTO): Promise<Plugin> {
    const plugin = await this.pluginRepo.findOneOrFail(pluginId)

    if (dto.options) {
      for (const optionDTO of dto.options) {
        // const pluginOption = plugin.options.getItems().find((o) => o.key === optionDTO.key)
        const pluginOption = plugin.options.find((o) => o.key === optionDTO.key)
        if (!pluginOption) throw new BadRequestException('选项不存在')
        pluginOption.value = optionDTO.value
      }
    }

    if (dto.status && dto.status !== plugin.status) {
      if (dto.status === PluginStatus.ENABLED) {
        // 启用编译器必须检查编译器是否可用
        try {
          const [ws] = await this.webSocketService.connect(plugin.url)
          ws.close()
        } catch (err) {
          throw new BadRequestException('无法连接编译器')
        }
      }

      plugin.status = dto.status
    }

    await this.em.persistAndFlush(plugin)
    return plugin
  }

  async remove(pluginId: string): Promise<Plugin> {
    const plugin = await this.pluginRepo.findOneOrFail(pluginId, { populate: ['sdks'] })
    await this.em.removeAndFlush(plugin)
    return plugin
  }

  async broadcast<E extends PluginEventName>(event: string, data: Omit<PluginEventMessageDataMap[E], 'plugin'>): Promise<void> {
    this.logger.debug(`Broadcast ${event} event to ${this.webSocketMap.size} plugins `)

    for (const [id, ws] of this.webSocketMap.entries()) {
      this.logger.debug(`Broadcast ${event} event to id:${id}`)

      const plugin = await this.pluginRepo.findOneOrFail(id)

      const fullData = { ...data, plugin: wrap(plugin).toObject() } as unknown as PluginEventMessageDataMap[E]

      await this.webSocketService.send(ws, event, fullData)
    }
  }

  async unicast<E extends PluginEventName>(pluginId: string, event: string, data: Omit<PluginEventMessageDataMap[E], 'plugin'>): Promise<void> {
    const ws = this.webSocketMap.get(pluginId)
    if (!ws) throw new BadRequestException('编译器未连接')

    this.logger.debug(`Unicast ${event} event to id:${pluginId}`)

    const plugin = await this.pluginRepo.findOneOrFail(pluginId)

    const fullData = { ...data, plugin: wrap(plugin).toObject() } as unknown as PluginEventMessageDataMap[E]

    await this.webSocketService.send(ws, event, fullData)
  }

  async updateMetadata(pluginId: string, metadata: PluginMetadata) {
    const plugin = await this.pluginRepo.findOneOrFail(pluginId)

    this.validateApiVersion(metadata.apiVersion)

    if (metadata.name) plugin.name = metadata.name
    if (metadata.description) plugin.description = metadata.description
    if (metadata.author) plugin.author = metadata.author
    if (metadata.version) plugin.version = metadata.version
    if (metadata.options) {
      const options = metadata.options

      plugin.options.remove((item) => options.every((option) => option.key !== item.key))

      for (const [index, option] of options.entries()) {
        let o = plugin.options.find((item) => item.key === option.key)

        if (!o) {
          o = this.pluginOptionRepo.create({
            key: option.key,
            description: option.description || '',
            label: option.label || option.key,
            format: option.format,
            order: index + 1,
            value: option.value,
            plugin,
          })
        } else {
          o.description = option.description || ''
          o.label = option.label || option.key
          o.format = option.format
          o.order = index + 1
        }
      }
    }

    await this.em.persistAndFlush(plugin)
  }
}
