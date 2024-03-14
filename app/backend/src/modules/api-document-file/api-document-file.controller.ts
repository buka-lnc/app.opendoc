import { Controller, Get, Query } from '@nestjs/common'
import { ApiDocumentFileService } from './api-document-file.service'
import { QueryApiDocumentFilesDTO } from './dto/query-api-document-files.dto'


@Controller('api-document-file')
export class ApiDocumentFileController {
  constructor(
    private readonly apiDocumentFileService: ApiDocumentFileService,
  ) {}

  @Get()
  async queryApiDocumentFiles(
    @Query() dto: QueryApiDocumentFilesDTO,
  ) {
    return await this.apiDocumentFileService.queryApiDocumentFiles(dto)
  }
}
