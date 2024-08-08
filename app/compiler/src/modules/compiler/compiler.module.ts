import { Module } from '@nestjs/common'
import { CompilerService } from './compiler.service'
import { WebSocketService } from './web-socket.service'
import { CompilerGateway } from './compiler.gateway'


@Module({
  imports: [],
  providers: [
    CompilerService,
    CompilerGateway,
    WebSocketService,
  ],
})
export class CompilerModule {}
