import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { PluginCommandMessage } from '~/api/backend/components/schemas'
import { WebSocket } from 'ws'


@Injectable()
export class WebSocketService {
  constructor(
    @InjectPinoLogger(WebSocketService.name)
    private readonly logger: PinoLogger
  ) {}

  sendCommand(ws: WebSocket, command: PluginCommandMessage['command'], data: any) {
    const message: PluginCommandMessage = {
      command,
      data,
    }

    ws.send(JSON.stringify(message))
  }
}
