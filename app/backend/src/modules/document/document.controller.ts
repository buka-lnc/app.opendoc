import { EntityManager } from '@mikro-orm/core'
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes } from '@nestjs/swagger'
import { DocumentService } from './document.service'
import { RegisterDocumentDTO } from './dto/register-document.dto'


@Controller('document')
export class DocumentController {
  constructor(
    private readonly em: EntityManager,
    private readonly documentService: DocumentService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async registerDocument(
    @Body() dto: RegisterDocumentDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.documentService.register({
      ...dto,
      file: file.buffer,
    })

    await this.em.flush()
  }

  @Post('sync')
  async syncDocuments() {
    await this.documentService.syncDocuments()
  }
}
