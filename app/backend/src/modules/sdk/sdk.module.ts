import { Module } from '@nestjs/common'
import { SdkController } from './sdk.controller'
import { SdkService } from './sdk.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Sdk } from './entities/sdk.entity'
import { SdkListener } from './sdk.listener'
// import { PublishService } from './publish.service'
import { SdkPublishLock } from './entities/sdk-publish-lock.entity'
import { SdkSubscriber } from './sdk.subscriber'
// import { CompilerService } from './compiler.service'
import { StorageModule } from '../storage/storage.module'
import { ApiFileModule } from '../api-file/api-file.module'
import { ApiFile } from '../api-file/entities/api-file.entity'
import { SheetVersionModule } from '../sheet-version/sheet-version.module'


@Module({
  imports: [
    ApiFileModule,
    StorageModule,
    SheetVersionModule,
    MikroOrmModule.forFeature([
      ApiFile,
      Sdk,
      SdkPublishLock,
    ]),
  ],
  controllers: [SdkController],
  providers: [SdkService, SdkListener, SdkSubscriber],
  exports: [SdkService],
})
export class SdkModule {}
