import { Controller, Get, Query } from '@nestjs/common'
import { ApiDocumentFileService } from './api-document-file.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { QueryApiDocumentFilesDTO } from './dto/query-api-document-files.dto'


@ApiTags('API 文件')
@Controller('api-document-file')
export class ApiDocumentFileController {
  constructor(
    private readonly apiDocumentFileService: ApiDocumentFileService,
  ) {}

  @Get()
  @ApiOperation({ summary: '查询 API 文件列表' })
  async queryApiDocumentFiles(
    @Query() dto: QueryApiDocumentFilesDTO,
  ) {
    return await this.apiDocumentFileService.queryApiDocumentFiles(dto)
  }
}
