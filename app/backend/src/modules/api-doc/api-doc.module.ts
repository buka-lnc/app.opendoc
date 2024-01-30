import { Module } from '@nestjs/common'
import { DocNodeModule } from '../doc-node/doc-node.module'
import { ApiDocService } from './api-doc.service'

@Module({
  imports: [DocNodeModule],
  providers: [ApiDocService],
})
export class ApiDocModule {}
