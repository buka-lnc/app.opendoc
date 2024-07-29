import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import WebSocket from 'ws'
import { isURL } from 'class-validator'
import { nanoid } from 'nanoid'


@Injectable()
export class WebSocketService {
  constructor(
    @InjectPinoLogger(WebSocketService.name)
    private readonly logger: PinoLogger,
  ) {}

  async connect(url: string): Promise<WebSocket> {
    if (!isURL(url, { require_host: true, require_protocol: true, protocols: ['ws'] })) {
      throw new BadRequestException('Invalid URL')
    }

    return await new Promise<WebSocket>((resolve, reject) => {
      const ws = new WebSocket(url)

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
}
