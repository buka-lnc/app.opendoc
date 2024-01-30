import { Body, Controller, Post } from '@nestjs/common'
import { DocNodeService } from './doc-node.service'
import { RegisterDocNodeDto } from './dto/register-doc-node.dto'


@Controller()
export class DocNodeController {
  constructor(
    private readonly docNodeService: DocNodeService
  ) {}

  @Post()
  async registerDocNode(
    @Body() dto: RegisterDocNodeDto
  ): Promise<void> {
    return this.docNodeService.register(dto)
  }
}
