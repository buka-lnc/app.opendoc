import { EntityManager } from '@mikro-orm/core'
import { Body, Controller, Get, Param, Post, Query, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes } from '@nestjs/swagger'
import { ApiDocumentService } from './api-document.service'
import { QueryApiDocumentsDTO } from './dto/query-api-documents.dto'
import { RegisterApiDocumentDTO } from './dto/register-api-document.dto'
import { ApiDocument } from './entities/api-document.entity'


@Controller()
export class ApiDocumentController {
  constructor(
    private readonly em: EntityManager,
    private readonly apiDocumentService: ApiDocumentService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async registerApiDocument(
    @Body() dto: RegisterApiDocumentDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.apiDocumentService.register({
      ...dto,
      file: file.buffer,
    })
  }

  @Post('document/sync')
  async syncApiDocuments(): Promise<void> {
    await this.apiDocumentService.syncDocuments()
  }

  @Get('document')
  async queryApiDocuments(
    @Query() dto: QueryApiDocumentsDTO,
  ): Promise<ApiDocument[]> {
    return this.apiDocumentService.queryDocuments(dto)
  }

  @Get('document/:documentId')
  async queryApiDocumentById(
    @Param('documentId') documentId: string,
  ): Promise<ApiDocument> {
    return this.apiDocumentService.queryDocumentById(documentId)
  }

  @Get('document/:documentId/file')
  async queryApiDocumentFile(
    @Param('documentId') documentId: string,
  ): Promise<StreamableFile> {
    const stream = await this.apiDocumentService.queryDocumentFileById(documentId)
    return new StreamableFile(stream)
  }

  @Get('folder/:folderId/document/:documentCode')
  async queryApiDocumentByCode(
    @Param('folderId') folderId: string,
    @Param('documentCode') documentCode: string,
  ): Promise<ApiDocument> {
    return this.apiDocumentService.queryDocumentByCode(folderId, documentCode)
  }
}
