import { Module } from '@nestjs/common'
import { ApiDocumentService } from './api-document.service'
import { ApiDocumentController } from './api-document.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApiDocument } from './entities/api-document.entity'
import { Application } from '../application/entity/application.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Application,
      ApiDocument,
    ]),
  ],
  controllers: [ApiDocumentController],
  providers: [ApiDocumentService],
  exports: [ApiDocumentService],
})
export class ApiDocumentModule {}
