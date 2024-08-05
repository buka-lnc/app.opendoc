import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import WebSocket from 'ws'
import { isURL } from 'class-validator'
import { nanoid } from 'nanoid'
import { version } from '~~/package.json'
import { AppConfig } from '~/config/app.config'
import { CompilerEventMessageDTO } from './dto/compiler-event-message.dto'
import { CompilerEvent } from './constants/compiler-message-event'
import { CompilerEventData } from './types/compiler-event-data'


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

  async sendAndWait<S extends CompilerEvent, W extends CompilerEvent>(
    ws: WebSocket,
    sendEvent: { event: S; data?: CompilerEventData[S] },
    waitEvent: { event: W; ttl?: number },
  ): Promise<CompilerEventData[W]> {
    return await new Promise<CompilerEventData[W]>((resolve, reject) => {
      const messageId = nanoid()
      const message = JSON.stringify({ id: messageId, ...sendEvent })
      const ttl = waitEvent.ttl || this.appConfig.ttl

      const ttlHandler = setTimeout(() => {
        ws.off('message', onMessage)
        reject(new BadRequestException('Timeout'))
      }, ttl)

      function onMessage(data: Buffer, isBuffer: boolean) {
        if (!isBuffer) {
          const message = <CompilerEventMessageDTO>JSON.parse(data.toString())

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
