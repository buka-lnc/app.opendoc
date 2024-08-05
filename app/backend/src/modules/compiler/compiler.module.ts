import { Module } from '@nestjs/common'
import { CompilerController } from './compiler.controller'
import { CompilerService } from './compiler.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Compiler } from './entities/compiler.entity'
import { WebSocketService } from './web-socket.service'
import { CompilerOption } from './entities/compiler-option.entity'
import { CompilerListener } from './compiler.listener'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Compiler,
      CompilerOption,
    ]),
  ],
  controllers: [CompilerController],
  providers: [WebSocketService, CompilerService, CompilerListener],
})
export class CompilerModule {
}
