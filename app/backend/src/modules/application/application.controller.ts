import { ResponseOfQueryApplicationsDTO } from './dto/response-of-query-applications.dto'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApplicationService } from './application.service'
import { RegisterApplicationDTO } from './dto/register-application.dto'
import { QueryApplicationsDTO } from './dto/query-applications.dto'
import { Application } from './entity/application.entity'
import { ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { EntityManager } from '@mikro-orm/core'
import { CreateApplicationDTO } from './dto/create-application.dto'


@ApiTags('Application')
@Controller('application')
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class ApplicationController {
  constructor(
    private readonly em: EntityManager,
    private readonly applicationService: ApplicationService
  ) {}

  @Put()
  @ApiOperation({ summary: '注册应用' })
  async registerApplication(
    @Body() dto: RegisterApplicationDTO
  ): Promise<void> {
    await this.applicationService.register(dto)
  }

  @Post()
  @ApiOperation({ summary: '创建应用' })
  async createApplication(
    @Body() dto: CreateApplicationDTO,
  ): Promise<Application> {
    return await this.applicationService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '查询应用列表' })
  async queryApplications(
    @Query() dto: QueryApplicationsDTO
  ): Promise<ResponseOfQueryApplicationsDTO> {
    return this.applicationService.queryAll(dto)
  }

  @Get(':applicationIdOrCode')
  @ApiOperation({ summary: '查询应用详情' })
  async queryApplication(
    @Param('applicationIdOrCode') applicationIdOrCode: string
  ): Promise<Application> {
    return this.applicationService.queryByIdOrCode(applicationIdOrCode)
  }

  @Delete(':applicationIdOrCode')
  @ApiOperation({ summary: '删除应用' })
  async deleteApplication(
    @Param('applicationIdOrCode') applicationIdOrCode: string
  ): Promise<void> {
    await this.applicationService.remove(applicationIdOrCode)
  }
}

