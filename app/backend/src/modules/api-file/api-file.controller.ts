import { ApiFileService } from './api-file.service'
import { Controller, Get, Param, Query, StreamableFile } from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { QueryApiFilesDTO } from './dto/query-api-files.dto'
import { ResponseOfQueryApiFilesDTO } from './dto/response-of-query-api-files.dto'
import { ApiFile } from './entities/api-file.entity'
import { EntityManager } from '@mikro-orm/core'
import { MikroORM } from '@mikro-orm/mysql'


@ApiTags('API 文件')
@Controller('api-file')
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class ApiFileController {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly ApiFileService: ApiFileService,
  ) {}

  @Get()
  @ApiOperation({ summary: '查询 API 文件列表' })
  async queryApiFiles(
    @Query() dto: QueryApiFilesDTO,
  ): Promise<ResponseOfQueryApiFilesDTO> {
    return await this.ApiFileService.queryApiFiles(dto)
  }

  @Get(':apiFileId')
  @ApiOperation({ summary: '获取 API 文件' })
  async queryApiFile(
    @Param('apiFileId') apiFileId: string,
  ): Promise<ApiFile> {
    return await this.ApiFileService.queryApiFile(apiFileId)
  }

  @Get(':apiFileId/raw')
  @ApiOperation({ summary: '获取 API 文件内容' })
  @ApiOkResponse({
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async queryApiFileRaw(
    @Param('apiFileId') apiFileId: string,
  ): Promise<StreamableFile> {
    const stream = await this.ApiFileService.queryApiFileRaw(apiFileId)
    return new StreamableFile(stream)
  }
}

