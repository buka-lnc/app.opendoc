import { CreateSdkDTO, SdkCreatedPluginEventMessageData, SheetVersionBumpPluginEventMessageData, UpdateSdkDTO } from '~/api/backend/components/schemas'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import WebSocket from 'ws'
import { Server } from 'http'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { IncomingMessage } from 'http'
import Handlebars from 'handlebars'
import { CompilerService } from './compiler.service'
import { AppConfig } from '~/config/app.config'
import { OpendocMetadata } from './types/opendoc-metadata'
import { WebSocketService } from './web-socket.service'


@WebSocketGateway({ path: '/typescript' })
export class CompilerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private opendocMetadataMap = new Map<WebSocket, OpendocMetadata>()

  constructor(
    @InjectPinoLogger(CompilerGateway.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly compilerService: CompilerService,

    private readonly webSocketService: WebSocketService,
  ) {}

  private prefixLog(client: WebSocket): string {
    const metadata = this.opendocMetadataMap.get(client)
    return metadata ? `[${metadata.name}] [v${metadata.apiVersion}]` : '[unknown]'
  }

  afterInit() {
    this.logger.info(`websocket listen on ${this.appConfig.host}:${this.appConfig.port}`)
  }

  handleConnection(client: WebSocket, request: IncomingMessage) {
    const clientVersion = request.headers['x-opendoc-client-api-version'] as string
    const clientName = request.headers['x-opendoc-client-name'] as string

    const opendocMetadata: OpendocMetadata = {
      apiVersion: clientVersion,
      name: clientName,
    }
    this.opendocMetadataMap.set(client, opendocMetadata)

    this.logger.info(`${this.prefixLog(client)} WebSocket Client Connected`)

    this.webSocketService.sendCommand(client, 'join', this.compilerService.metadata)
  }

  handleDisconnect(client: WebSocket) {
    const opendocInformation = this.opendocMetadataMap.get(client)
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
    @MessageBody() data: SheetVersionBumpPluginEventMessageData,
  ): void {
    this.logger.debug(`${this.prefixLog(client)} sheet-version-bump`)

    const templateOption = data.plugin.options.find((option) => option.key === 'packageNameTemplate')
    if (!templateOption) {
      this.logger.error(`${this.prefixLog(client)} missing option: packageNameTemplate`)
      return
    }

    const packageName = Handlebars.compile(templateOption.value)(data)

    this.webSocketService.sendCommand(client, 'create-sdk', <CreateSdkDTO>{
      name: packageName,
      sheet: { id: data.sheet.id },
      plugin: { id: data.plugin.id },
      version: data.version,
    })
  }

  @SubscribeMessage('sdk-created')
  async onSdkCreated(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: SdkCreatedPluginEventMessageData,
  ): Promise<void> {
    console.log('🚀 ~ CompilerGateway ~ data:', data)
    this.logger.debug(`${this.prefixLog(client)} sdk-created`)

    if (data.sdk.plugin.id !== data.plugin.id) {
      this.logger.debug(`${this.prefixLog(client)} ignore sdk-created event from other plugin`)
      return
    }

    this.webSocketService.sendCommand(client, 'update-sdk', <UpdateSdkDTO> {
      id: data.sdk.id,
      status: 'compiling',
    })

    try {
      await this.compilerService.compile(data)

      this.webSocketService.sendCommand(client, 'update-sdk', <UpdateSdkDTO> {
        id: data.sdk.id,
        status: 'published',
      })
    } catch (err) {
      this.webSocketService.sendCommand(client, 'update-sdk', <UpdateSdkDTO> {
        id: data.sdk.id,
        status: 'failed',
      })
    }
  }
}

