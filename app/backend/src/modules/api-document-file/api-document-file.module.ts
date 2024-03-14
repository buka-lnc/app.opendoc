import { Module } from '@nestjs/common'
import { ApiDocumentFileController } from './api-document-file.controller'
import { ApiDocumentFileService } from './api-document-file.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApiDocument } from '~/modules/api-document/entities/api-document.entity'
import { ApiDocumentFile } from './entities/api-document-file.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      ApiDocument,
      ApiDocumentFile,
    ]),
  ],
  controllers: [ApiDocumentFileController],
  providers: [ApiDocumentFileService],
  exports: [ApiDocumentFileService],
})
export class ApiDocumentFileModule {}
