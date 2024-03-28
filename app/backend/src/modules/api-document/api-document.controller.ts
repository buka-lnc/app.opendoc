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
import { Sdk } from '../sdk/entity/sdk.entity'
import { SdkService } from '../sdk/sdk.service'
import { CreateApiDocumentDTO } from './dto/create-api-document.dto'

@ApiTags('API 文档')
@Controller('api-document')
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class ApiDocumentController {
  constructor(
    private readonly em: EntityManager,
    private readonly apiDocumentService: ApiDocumentService,
    private readonly apiDocumentFileService: ApiDocumentFileService,
    private readonly sdkService: SdkService,
  ) {}

  @Put()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '注册 API 文档',
    description: '若 applicationCode 指定的应用不存在，则会新建一个应用；否则，更新应用。',
  })
  @UseInterceptors(FileInterceptor('apiDocumentFile'))
  async registerApiDocument(
    @Body() dto: RegisterApiDocumentDTO,
    @UploadedFile() apiDocumentFile: Express.Multer.File,
  ): Promise<void> {
    await this.apiDocumentService.register({
      ...dto,
      apiDocumentFile: apiDocumentFile.buffer,
    })
  }

  @Post()
  @ApiOperation({ summary: '创建 API 文档' })
  async createApiDocument(
    @Body() dto: CreateApiDocumentDTO,
  ): Promise<ApiDocument> {
    return this.apiDocumentService.create(dto)
  }

  @Post('sync')
  @ApiOperation({ summary: '同步 API 文档', description: '每隔 10 分钟自动同步一次' })
  async syncApiDocuments(): Promise<void> {
    await this.apiDocumentService.syncDocuments()
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
  @ApiOperation({ summary: '查询某一 API 文档的某一标签的文件' })
  async queryApiDocumentFileByTag(
    @Param('tagName') tagName: string,
    @Param('apiDocumentId') id: string,
  ): Promise<ApiDocumentFile> {
    return await this.apiDocumentFileService.queryDocumentFileByTag(id, tagName)
  }

  @Get(':apiDocumentId/version/:version/api-document-file')
  @ApiOperation({ summary: '查询某一 API 文档的某一版本的文件' })
  async queryApiDocumentFileByVersion(
    @Param('version') version: string,
    @Param('apiDocumentId') id: string,
  ): Promise<ApiDocumentFile> {
    return await this.apiDocumentFileService.queryDocumentFileByVersion(id, version)
  }

  @Get(':apiDocumentId/version/:version/api-document-file/raw')
  @ApiOperation({ summary: '下载某一 API 文档的某一版本的文件内容' })
  async queryRawApiDocumentFileByVersion(
    @Param('version') version: string,
    @Param('apiDocumentId') id: string,
  ): Promise<StreamableFile> {
    const stream = await this.apiDocumentFileService.queryRawDocumentFileByVersion(id, version)
    return new StreamableFile(stream)
  }

  @Get(':apiDocumentId/sdk')
  @ApiOperation({ summary: '查询 API 文档的 SDK 列表' })
  async querySdkByApiDocumentId(
    @Param('apiDocumentId') id: string,
  ): Promise<Sdk[]> {
    return this.apiDocumentService.querySdkByApiDocumentId(id)
  }

  @Get(':apiDocumentId/version/:version/sdk')
  @ApiOperation({ summary: '查询 API 文档的某一版本的 SDK' })
  async querySdkByVersion(
    @Param('version') version: string,
    @Param('apiDocumentId') id: string,
  ): Promise<Sdk> {
    return this.sdkService.querySdkByVersion(id, version)
  }
}
