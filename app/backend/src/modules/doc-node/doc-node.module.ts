import { Module } from '@nestjs/common'
import { DocNodeService } from './doc-node.service'


@Module({
  providers: [DocNodeService],
  exports: [DocNodeService],
})
export class DocNodeModule {

}
