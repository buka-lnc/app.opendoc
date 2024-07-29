import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import WebSocket from 'ws'
import { isURL } from 'class-validator'
import { nanoid } from 'nanoid'
import { version } from '~~/package.json'
import { AppConfig } from '~/config/app.config'
import { CompilerMessageDTO } from './dto/compiler-message.dto'
import { WebSocketFetchOptions } from './types/web-socket-fetch-options'
import { CompilerMessageEvent } from './constants/compiler-message-event'
import { CompilerMessageEventResponse } from './types/compiler-message-event-response'


@Injectable()
export class WebSocketService {
  constructor(
    @InjectPinoLogger(WebSocketService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
  ) {}

  async connect(url: string): Promise<WebSocket> {
    if (!isURL(url, { require_host: true, require_protocol: true, protocols: ['ws'] })) {
      throw new BadRequestException('Invalid URL')
    }

    return await new Promise<WebSocket>((resolve, reject) => {
      const ws = new WebSocket(url, {
        headers: {
          'x-opendoc-client-version': version,
          'x-opendoc-client-name': this.appConfig.appName,
        },
      })

      let pending = true
      ws.on('open', () => {
        this.logger.info(`Compiler ${url} is enabled`)

        if (pending) {
          pending = false
          resolve(ws)
        }
      })

      ws.on('error', (err) => {
        this.logger.error(`Compiler ${url} is breakdown`)

        if (pending) {
          pending = false
          ws.close()
          reject(err)
        }
      })
    })
  }

  async send(ws: WebSocket, event: string, data?: any): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      ws.send(JSON.stringify({ id: nanoid(), event, data }), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async fetch<E extends CompilerMessageEvent >(ws: WebSocket, options: WebSocketFetchOptions<E>): Promise<CompilerMessageEventResponse[E]> {
    const { event, data, ttl = this.appConfig.ttl } = options

    return await new Promise<CompilerMessageEventResponse[E]>((resolve, reject) => {
      const messageId = nanoid()
      const message = JSON.stringify({ id: messageId, event, data })

      const ttlHandler = setTimeout(() => {
        ws.off('message', onMessage)
        reject(new BadRequestException('Timeout'))
      }, ttl)

      function onMessage(data: Buffer, isBuffer: boolean) {
        if (!isBuffer) {
          const message = <CompilerMessageDTO>JSON.parse(data.toString())

          if (message.id === messageId) {
            clearTimeout(ttlHandler)
            ws.off('message', onMessage)
            resolve(message.data)
          }
        } else {
          reject(new BadRequestException('Invalid Websocket message'))
        }
      }

      ws.on('message', onMessage)

      ws.send(message, (err) => {
        if (err) {
          reject(err)
          return
        }
      })
    })
  }
}
