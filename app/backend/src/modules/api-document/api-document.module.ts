import { Module } from '@nestjs/common'
import { ApiDocumentService } from './api-document.service'
import { ApiDocumentController } from './api-document.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApiDocument } from './entities/api-document.entity'
import { Application } from '../application/entity/application.entity'
import { ApiDocumentFile } from './entities/api-document-file.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Application,
      ApiDocument,
      ApiDocumentFile,
    ]),
  ],
  controllers: [ApiDocumentController],
  providers: [ApiDocumentService],
  exports: [ApiDocumentService],
})
export class ApiDocumentModule {}
