import { Module } from '@nestjs/common'
import { FolderModule } from '../folder/folder.module'
import { ApiDocumentService } from './api-document.service'
import { ApiDocumentController } from './api-document.controller'


@Module({
  imports: [FolderModule],
  controllers: [ApiDocumentController],
  providers: [ApiDocumentService],
  exports: [ApiDocumentService],
})
export class ApiDocumentModule {}
