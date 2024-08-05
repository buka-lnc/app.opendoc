import { CreateSdkDTO } from '~/api/backend/components/schemas'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { CompilerInformation, SheetVersionBumpEventMessageDataDTO } from './api/backend/components/schemas'
import WebSocket from 'ws'
import { Server } from 'http'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from './config/app.config'
import { AppService } from './app.service'
import { IncomingMessage } from 'http'
import { OpendocInformationDTO } from './dto/opendoc-information.dto'
import Handlebars from 'handlebars'


@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  opendocInformationMap = new Map<WebSocket, OpendocInformationDTO>()

  constructor(
    @InjectPinoLogger(AppGateway.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
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

  @SubscribeMessage('compiler-join')
  introduce(@ConnectedSocket() client): CompilerInformation {
    this.logger.debug(`${this.prefixLog(client)} compiler-join`)

    return this.appService.getInformation()
  }

  @SubscribeMessage('sheet-version-bump')
  compile(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: SheetVersionBumpEventMessageDataDTO,
  ): void {
    const templateOption = data.compiler.options.find((option) => option.key === 'packageNameTemplate')
    if (!templateOption) {
      this.logger.error(`${this.prefixLog(client)} missing option: packageNameTemplate`)
      return
    }

    console.log('🚀 ~ AppGateway ~ templateOption:', templateOption)

    const packageName = Handlebars.compile(templateOption.value)(data)
    console.log('🚀 ~ AppGateway ~ packageName:', packageName)

    client.send(JSON.stringify({
      event: 'create-sdk',
      data: <CreateSdkDTO>{
        name: packageName,
        sheet: { id: data.sheet.id },
        compiler: { id: data.compiler.id },
        version: data.version,
      },
    }))

    this.logger.debug(`${this.prefixLog(client)} sheet-version-bump`)

    // this.appService.compile()
    console.log('🚀 ~ AppGateway ~ data:', data)
  }
}
