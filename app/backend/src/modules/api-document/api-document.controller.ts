import { ApiDocumentFileService } from '~/modules/api-document-file/api-document-file.service'
import { EntityManager } from '@mikro-orm/core'
import { Body, Controller, Get, Param, Post, Put, Query, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiDocumentService } from './api-document.service'
import { QueryApiDocumentsDTO } from './dto/query-api-documents.dto'
import { RegisterApiDocumentDTO } from './dto/register-api-document.dto'
import { ApiDocument } from './entities/api-document.entity'
import { QueryApiDocumentsResponseDTO } from './dto/query-api-documents-response.dto'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'

@ApiTags('API 文档')
@Controller('api-document')
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class ApiDocumentController {
  constructor(
    private readonly em: EntityManager,
    private readonly apiDocumentService: ApiDocumentService,
    private readonly apiDocumentFileService: ApiDocumentFileService,
  ) {}

  @Put()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '注册 API 文档',
    description: '若 applicationCode 指定的应用不存在，则会新建一个应用；否则，更新应用。',
  })
  @UseInterceptors(FileInterceptor('file'))
  async registerApiDocument(
    @Body() dto: RegisterApiDocumentDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.apiDocumentService.register({
      ...dto,
      apiDocumentFile: file.buffer,
    })

    await this.em.flush()
  }

  @Post('sync')
  @ApiOperation({ summary: '同步 API 文档', description: '每隔 10 分钟自动同步一次' })
  async syncApiDocuments(): Promise<void> {
    await this.apiDocumentService.syncDocuments()
    await this.em.flush()
  }

  @Get()
  @ApiOperation({ summary: '查询 API 文档列表' })
  async queryApiDocuments(
    @Query() dto: QueryApiDocumentsDTO,
  ): Promise<QueryApiDocumentsResponseDTO> {
    return this.apiDocumentService.queryDocuments(dto)
  }

  @Get(':apiDocumentId')
  @ApiOperation({ summary: '查询 API 文档详情' })
  async queryApiDocumentById(
    @Param('apiDocumentId') id: string,
  ): Promise<ApiDocument> {
    return this.apiDocumentService.queryDocumentById(id)
  }

  @Get(':apiDocumentId/api-document-file')
  @ApiOperation({ summary: '查询 API 文档文件列表' })
  async queryApiDocumentFilesByApiDocumentId(
    @Param('apiDocumentId') id: string,
  ): Promise<ApiDocumentFile[]> {
    return await this.apiDocumentFileService.queryApiDocumentFiles({
      apiDocumentIds: [id],
    })
  }

  @Get(':apiDocumentId/tag/:tagName/api-document-file')
  @ApiOperation({ summary: '查询 API 文档标签列表' })
  async queryApiDocumentTags(
    @Param('tagName') tagName: string,
    @Param('apiDocumentId') id: string,
  ): Promise<ApiDocumentFile[]> {
    return await this.apiDocumentFileService.queryApiDocumentFiles({
      apiDocumentIds: [id],
      tags: [tagName],
    })
  }

  @Get(':apiDocumentId/version/:version/api-document-file/raw')
  @ApiOperation({ summary: '查询某一个版本的 API 文档' })
  async queryRawApiDocumentFileByVersion(
    @Param('version') version: string,
    @Param('apiDocumentId') id: string,
  ): Promise<StreamableFile> {
    const stream = await this.apiDocumentFileService.queryRawDocumentFileByVersion(id, version)
    return new StreamableFile(stream)
  }
}
