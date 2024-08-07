import { Module } from '@nestjs/common'
import { CompilerController } from './compiler.controller'
import { CompilerService } from './compiler.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Compiler } from './entities/compiler.entity'
import { WebSocketService } from './web-socket.service'
import { CompilerOption } from './entities/compiler-option.entity'
import { CompilerListener } from './compiler.listener'
import { SheetModule } from '../sheet/sheet.module'
import { SheetVersionModule } from '../sheet-version/sheet-version.module'
import { CompilerGateway } from './compiler.gateway'
import { SheetVersion } from '../sheet-version/entities/sheet-version.entity'
import { Sheet } from '../sheet/entities/sheet.entity'
import { Sdk } from '../sdk/entities/sdk.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Compiler,
      CompilerOption,
      SheetVersion,
      Sheet,
      Sdk,
    ]),
    SheetModule,
    SheetVersionModule,
  ],
  controllers: [CompilerController],
  providers: [WebSocketService, CompilerService, CompilerListener, CompilerGateway],
})
export class CompilerModule {
}
