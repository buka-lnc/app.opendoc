import { EntityManager } from '@mikro-orm/core'
import { Body, Controller, Get, Param, Post, Query, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes } from '@nestjs/swagger'
import { ApiDocumentService } from './api-document.service'
import { QueryApiDocumentsDTO } from './dto/query-api-documents.dto'
import { RegisterApiDocumentDTO } from './dto/register-api-document.dto'
import { ApiDocument } from './entities/api-document.entity'
import { QueryApiDocumentsResponseDTO } from './dto/query-api-documents-response.dto'


@Controller('api-document')
export class ApiDocumentController {
  constructor(
    private readonly em: EntityManager,
    private readonly apiDocumentService: ApiDocumentService,
  ) {}

  /**
   * 注册 API 文档
   */
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async registerApiDocument(
    @Body() dto: RegisterApiDocumentDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.apiDocumentService.register({
      ...dto,
      apiDocumentFile: file.buffer,
    })
  }

  @Post('sync')
  async syncApiDocuments(): Promise<void> {
    await this.apiDocumentService.syncDocuments()
  }

  /**
   * 查询 API 文档列表
   */
  @Get()
  async queryApiDocuments(
    @Query() dto: QueryApiDocumentsDTO,
  ): Promise<QueryApiDocumentsResponseDTO> {
    return this.apiDocumentService.queryDocuments(dto)
  }

  /**
   * 查询 API 文档详情
   */
  @Get(':apiDocumentId')
  async queryApiDocumentById(
    @Param('apiDocumentId') id: string,
  ): Promise<ApiDocument> {
    return this.apiDocumentService.queryDocumentById(id)
  }

  /**
   * 查询 API 文档文件内容
   */
  @Get(':apiDocumentId/file')
  async queryApiDocumentFile(
    @Param('apiDocumentId') id: string,
  ): Promise<StreamableFile> {
    const stream = await this.apiDocumentService.queryDocumentFileById(id)
    return new StreamableFile(stream)
  }
}
