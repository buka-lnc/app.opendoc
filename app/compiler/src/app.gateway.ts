import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { CompilerInfoDTO } from './api/backend/components/schemas'
import WebSocket from 'ws'
import { Server } from 'http'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from './config/app.config'
import { AppService } from './app.service'
import { IncomingMessage } from 'http'
import { OpendocInformationDTO } from './dto/opendoc-information.dto'


@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  opendocInformationMap = new Map<WebSocket, OpendocInformationDTO>()

  constructor(
    private readonly appConfig: AppConfig,

    @InjectPinoLogger(AppGateway.name)
    private readonly logger: PinoLogger,

    private readonly appService: AppService,
  ) {}

  private prefixLog(client: WebSocket): string {
    const opendocInformation = this.opendocInformationMap.get(client)
    return opendocInformation ? `[${opendocInformation.name}] [v${opendocInformation.version}]` : '[unknown]'
  }

  afterInit() {
    this.logger.info(`websocket listen on ${this.appConfig.host}:${this.appConfig.port}`)
  }

  handleConnection(client: WebSocket, request: IncomingMessage) {
    const clientVersion = request.headers['x-opendoc-client-version'] as string
    const clientName = request.headers['x-opendoc-client-name'] as string

    const opendocInformation: OpendocInformationDTO = {
      version: clientVersion,
      name: clientName,
    }

    this.opendocInformationMap.set(client, opendocInformation)

    this.logger.info(`${this.prefixLog(client)} WebSocket Client Connected`)
  }

  handleDisconnect(client: WebSocket) {
    const opendocInformation = this.opendocInformationMap.get(client)
    if (opendocInformation) {
      this.logger.info(`${this.prefixLog(client)} WebSocket Client Disconnected`)
    }
  }


  @SubscribeMessage('health')
  health(): void {
    this.logger.info('health check')
  }

  @SubscribeMessage('info')
  info(@ConnectedSocket() client): CompilerInfoDTO {
    this.logger.debug(`${this.prefixLog(client)} Request Info`)
    return this.appService.getInfo()
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
