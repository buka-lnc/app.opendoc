import { Module } from '@nestjs/common'
import { FolderModule } from '../folder/folder.module'
import { DocumentController } from './document.controller'
import { DocumentService } from './document.service'


@Module({
  imports: [FolderModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
