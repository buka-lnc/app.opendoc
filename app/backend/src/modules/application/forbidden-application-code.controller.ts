import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ForbiddenApplicationCodeService } from './forbidden-application-code.service'
import { ForbiddenApplicationCode } from './entities/forbidden-application-code.entity'
import { CreateForbiddenApplicationCodeDTO } from './dto/create-forbidden-application-code.dto'


@Controller('forbidden-application-code')
export class ForbiddenApplicationCodeController {
  constructor(
    private readonly forbiddenApplicationCodeService: ForbiddenApplicationCodeService,
  ) {}

  @Get()
  async queryForbiddenApplicationCodes(): Promise<ForbiddenApplicationCode[]> {
    return await this.forbiddenApplicationCodeService.queryAll()
  }

  @Post()
  async createForbiddenApplicationCode(
    @Body() dto: CreateForbiddenApplicationCodeDTO,
  ): Promise<void> {
    await this.forbiddenApplicationCodeService.create(dto)
  }

  @Delete(':code')
  async deleteForbiddenApplicationCode(
    @Param('code') code: string
  ): Promise<void> {
    await this.forbiddenApplicationCodeService.remove(code)
  }
}
