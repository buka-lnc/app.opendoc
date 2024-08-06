import { CreateSdkDTO, SdkCreatedEventMessageDataDTO, UpdateSdkDTO } from '~/api/backend/components/schemas'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { SheetVersionBumpEventMessageDataDTO } from './api/backend/components/schemas'
import WebSocket from 'ws'
import { Server } from 'http'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from './config/app.config'
import { AppService } from './app.service'
import { IncomingMessage } from 'http'
import { OpendocInformationDTO } from './dto/opendoc-information.dto'
import Handlebars from 'handlebars'
import { CompilerService } from './compiler.service'


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
    private readonly compilerService: CompilerService,
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

    const info = this.appService.getInformation()
    client.send(JSON.stringify({
      event: 'compiler-information',
      data: info,
    }))
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

  @SubscribeMessage('sheet-version-bump')
  onSheetVersionBump(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: SheetVersionBumpEventMessageDataDTO,
  ): void {
    this.logger.debug(`${this.prefixLog(client)} sheet-version-bump`)

    const templateOption = data.compiler.options.find((option) => option.key === 'packageNameTemplate')
    if (!templateOption) {
      this.logger.error(`${this.prefixLog(client)} missing option: packageNameTemplate`)
      return
    }

    const packageName = Handlebars.compile(templateOption.value)(data)

    client.send(JSON.stringify({
      event: 'create-sdk',
      data: <CreateSdkDTO>{
        name: packageName,
        sheet: { id: data.sheet.id },
        compiler: { id: data.compiler.id },
        version: data.version,
      },
    }))
  }

  @SubscribeMessage('sdk-created')
  async onSdkCreated(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: SdkCreatedEventMessageDataDTO,
  ): Promise<void> {
    this.logger.debug(`${this.prefixLog(client)} sdk-created`)

    client.send(JSON.stringify({
      event: 'update-sdk',
      data: <UpdateSdkDTO> {
        id: data.sdk.id,
        status: 'compiling',
      },
    }))

    try {
      await this.compilerService.compile(data)
      client.send(JSON.stringify({
        event: 'update-sdk',
        data: <UpdateSdkDTO> {
          id: data.sdk.id,
          status: 'published',
        },
      }))
    } catch (err) {
      client.send(JSON.stringify({
        event: 'update-sdk',
        data: <UpdateSdkDTO> {
          id: data.sdk.id,
          status: 'failed',
        },
      }))
    }
  }
}
