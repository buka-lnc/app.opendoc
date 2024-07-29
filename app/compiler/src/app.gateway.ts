import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets'
import { CompilerInfoDTO } from './api/backend/components/schemas'
import WebSocket from 'ws'
import { Server } from 'http'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from './config/app.config'
import { version } from '~~/package.json'
import { AppService } from './app.service'


@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server

  constructor(
    private readonly appConfig: AppConfig,

    @InjectPinoLogger(AppGateway.name)
    private readonly logger: PinoLogger,

    private readonly appService: AppService,
  ) {}

  afterInit() {
    this.logger.info(`websocket listen on ${this.appConfig.host}:${this.appConfig.port}`)
  }

  @SubscribeMessage('health')
  health(): void {
    this.logger.info('health check')
  }

  @SubscribeMessage('info')
  info(@MessageBody() data): CompilerInfoDTO {
    console.log('🚀 ~ AppGateway ~ info ~ data:', data)
    this.logger.debug('WebSocket Request: info')

    return {
      name: '@opendoc/keq-compiler',
      description: 'Compiler for keq',
      author: 'Val-istar-Guo <val.istar.guo@gmail.com>',
      version,
      config: '',
    }
  }

  @SubscribeMessage('compile')
  compile(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: any,
  ): void {
    // this.appService.compile()
    console.log('🚀 ~ AppGateway ~ data:', data)
    client.send('hahaha')
    client.send('hahaha')
    client.send('hahaha')
    client.send('hahaha')
  }
}
