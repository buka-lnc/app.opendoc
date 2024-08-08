import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import WebSocket from 'ws'
import { isURL } from 'class-validator'
import { version as OPENDOC_API_VERSION } from '~~/package.json'
import { AppConfig } from '~/config/app.config'
import { PluginCommandMessage } from './dto/plugin-command-message.dto'
import { PluginCommandName } from './constants/plugin-command-name'
import { PluginMetadata } from './dto/plugin-command-message/plugin-metadata.dto'


@Injectable()
export class WebSocketService {
  constructor(
    @InjectPinoLogger(WebSocketService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
  ) {}

  async connect(url: string): Promise<[WebSocket, PluginMetadata]> {
    if (!isURL(url, { require_host: true, require_protocol: true, protocols: ['ws'] })) {
      throw new BadRequestException('Invalid URL')
    }

    const ttl = this.appConfig.ttl
    console.log('🚀 ~ WebSocketService ~ connect ~ ttl:', ttl)
    const appName = this.appConfig.appName
    const logger = this.logger

    return await new Promise<[WebSocket, PluginMetadata]>((resolve, reject) => {
      const ttlHandler = setTimeout(() => {
        ws.off('message', onMessage)
        ws.off('error', onError)
        ws.close()
        reject(new BadRequestException('Timeout'))
      }, ttl)

      function onMessage(data: Buffer, isBuffer: boolean) {
        if (!isBuffer) {
          const message = <PluginCommandMessage>JSON.parse(data.toString())
          if (message.command === PluginCommandName.JOIN) {
            clearTimeout(ttlHandler)
            ws.off('message', onMessage)
            ws.off('error', onError)

            const metadata = message.data as PluginMetadata
            resolve([ws, metadata])
          }
        } else {
          clearTimeout(ttlHandler)
          ws.off('message', onMessage)
          ws.off('error', onError)

          reject(new BadRequestException('Invalid Websocket message'))
        }
      }

      function onError(err: Error) {
        logger.error(`Plugin ${url} is breakdown`)
        clearTimeout(ttlHandler)
        ws.close()
        reject(err)
      }

      const ws = new WebSocket(url, {
        headers: {
          'x-opendoc-client-api-version': OPENDOC_API_VERSION,
          'x-opendoc-client-name': appName,
        },
      })

      ws.on('message', onMessage)
      ws.on('error', onError)
    })
  }

  async send(ws: WebSocket, event: string, data?: any): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      ws.send(JSON.stringify({ event, data }), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
