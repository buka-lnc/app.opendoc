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


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Compiler,
      CompilerOption,
    ]),
    SheetModule,
    SheetVersionModule,
  ],
  controllers: [CompilerController],
  providers: [WebSocketService, CompilerService, CompilerListener],
})
export class CompilerModule {
}
