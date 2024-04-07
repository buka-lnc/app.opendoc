import { Module } from '@nestjs/common'
import { SdkController } from './sdk.controller'
import { SdkService } from './sdk.service'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Sdk } from './entity/sdk.entity'
import { SdkListener } from './sdk.listener'
import { PublishService } from './publish.service'
import { ApiDocumentFileModule } from '../api-document-file/api-document-file.module'
import { SdkPublishLock } from './entity/sdk-publish-lock.entity'
import { SdkSubscriber } from './sdk.subscriber'
import { CompilerService } from './compiler.service'


@Module({
  imports: [
    ApiDocumentFileModule,
    MikroOrmModule.forFeature([
      ApiDocumentFile,
      Sdk,
      SdkPublishLock,
    ]),
  ],
  controllers: [SdkController],
  providers: [SdkService, SdkListener, PublishService, SdkSubscriber, CompilerService],
  exports: [SdkService],
})
export class SdkModule {}
