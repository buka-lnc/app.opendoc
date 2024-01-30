import { Injectable } from '@nestjs/common'
import { DocNodeService } from '../doc-node/doc-node.service'
import { RegisterApiDocDto } from './dto/register-api-doc.dto'

@Injectable()
export class ApiDocService {
  constructor(
    private readonly docNodeService: DocNodeService
  ) {}

  async register(dto: RegisterApiDocDto): Promise<void> {
    await this.docNodeService.ensure(dto.docNodeMpath)
  }
}
