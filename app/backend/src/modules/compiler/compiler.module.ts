import { Module } from '@nestjs/common'
import { CompilerController } from './compiler.controller'
import { CompilerService } from './compiler.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Compiler } from './entities/compiler.entity'
import { WebSocketService } from './web-socket.service'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Compiler,
    ]),
  ],
  controllers: [CompilerController],
  providers: [CompilerService, WebSocketService],
})
export class CompilerModule {
}
