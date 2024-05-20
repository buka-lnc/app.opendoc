import { Module } from '@nestjs/common'
import { SdkController } from './sdk.controller'
import { SdkService } from './sdk.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Sdk } from './entity/sdk.entity'
import { SdkListener } from './sdk.listener'
import { PublishService } from './publish.service'
import { SdkPublishLock } from './entity/sdk-publish-lock.entity'
import { SdkSubscriber } from './sdk.subscriber'
import { CompilerService } from './compiler.service'
import { StorageModule } from '../storage/storage.module'
import { ApiFileModule } from '../api-file/api-file.module'
import { ApiFile } from '../api-file/entities/api-file.entity'


@Module({
  imports: [
    ApiFileModule,
    StorageModule,
    MikroOrmModule.forFeature([
      ApiFile,
      Sdk,
      SdkPublishLock,
    ]),
  ],
  controllers: [SdkController],
  providers: [SdkService, SdkListener, PublishService, SdkSubscriber, CompilerService],
  exports: [SdkService],
})
export class SdkModule {}
