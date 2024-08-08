import { Module } from '@nestjs/common'
import { PluginController } from './plugin.controller'
import { PluginService } from './plugin.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Plugin } from './entities/plugin.entity'
import { WebSocketService } from './web-socket.service'
import { PluginOption } from './entities/plugin-option.entity'
import { PluginListener } from './plugin.listener'
import { SheetModule } from '../sheet/sheet.module'
import { SheetVersionModule } from '../sheet-version/sheet-version.module'
import { PluginGateway } from './plugin.gateway'
import { SheetVersion } from '../sheet-version/entities/sheet-version.entity'
import { Sheet } from '../sheet/entities/sheet.entity'
import { Sdk } from '../sdk/entities/sdk.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Plugin,
      PluginOption,
      SheetVersion,
      Sheet,
      Sdk,
    ]),
    SheetModule,
    SheetVersionModule,
  ],
  controllers: [PluginController],
  providers: [WebSocketService, PluginService, PluginListener, PluginGateway],
})
export class PluginModule {
}
