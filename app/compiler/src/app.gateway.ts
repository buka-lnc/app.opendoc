import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets'
import WebSocket from 'ws'
import { Server } from 'http'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from './config/app.config'


@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server

  constructor(
    private readonly appConfig: AppConfig,

    @InjectPinoLogger(AppGateway.name)
    private readonly logger: PinoLogger,
  ) {}

  afterInit() {
    this.logger.info(`websocket listen on ${this.appConfig.host}:${this.appConfig.port}`)
  }

  @SubscribeMessage('health')
  health(): void {
    this.logger.info('health check')
  }

  @SubscribeMessage('compile')
  compile(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: any,
  ): void {
    console.log('🚀 ~ AppGateway ~ data:', data)
    client.send('hahaha')
    client.send('hahaha')
    client.send('hahaha')
    client.send('hahaha')
  }
}
