import { Body, Controller, Post } from '@nestjs/common'
import { ApiDocService } from './api-doc.service'
import { RegisterApiDocDto } from './dto/register-api-doc.dto'

@Controller('api-doc')
export class ApiDocController {
  constructor(
    private readonly apiDocService: ApiDocService
  ) {}

  @Post()
  async registerApiDoc(
    @Body() dto: RegisterApiDocDto
  ) {
    return this.apiDocService.register(dto)
  }
}
