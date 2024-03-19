import { Module } from '@nestjs/common'
import { ApiDocumentService } from './api-document.service'
import { ApiDocumentController } from './api-document.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApiDocument } from './entities/api-document.entity'
import { Application } from '../application/entity/application.entity'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { ApiDocumentFileModule } from '../api-document-file/api-document-file.module'
import { SdkModule } from '../sdk/sdk.module'


@Module({
  imports: [
    ApiDocumentFileModule,
    SdkModule,
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
