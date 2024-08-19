import { Injectable, PayloadTooLargeException } from '@nestjs/common'
import * as path from 'path'
import dayjs from 'dayjs'
import * as fs from 'fs-extra'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EntityManager, wrap } from '@mikro-orm/core'
import { MikroORM } from '@mikro-orm/mysql'
import { PluginConfig } from '~/config/plugin.config'
import { Plugin } from './entities/plugin.entity'
import { Readable } from 'stream'


@Injectable()
export class PluginLogService {
  constructor(
    @InjectPinoLogger(PluginLogService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly pluginConfig: PluginConfig,
  ) {}

  private getLogFilepath(plugin: Plugin, date: string): string {
    return path.resolve(this.pluginConfig.logDirectory, plugin.id, date)
  }

  async query(plugin: Plugin, date: string): Promise<Readable> {
    const logFilepath = this.getLogFilepath(plugin, date)
    const stat = await fs.stat(logFilepath)
    if (stat.size > this.pluginConfig.maxLogSizeForQuery) {
      throw new PayloadTooLargeException('日志文件过大')
    }

    return fs.createReadStream(logFilepath, { encoding: 'utf-8' })
  }

  async append(plugin: Plugin, logs: string): Promise<void> {
    if (wrap(plugin).isInitialized()) {
      await wrap(plugin).init()
    }

    const today = dayjs().format('YYYY-MM-DD')
    const logFilepath = this.getLogFilepath(plugin, today)
    await fs.ensureFile(logFilepath)

    if (!logs.endsWith('\n')) {
      logs += '\n'
    }

    await fs.appendFile(logFilepath, logs)
  }
}
