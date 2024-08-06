import { Module } from '@nestjs/common'
import { SdkController } from './sdk.controller'
import { SdkService } from './sdk.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Sdk } from './entities/sdk.entity'
import { StorageModule } from '../storage/storage.module'
import { ApiFileModule } from '../api-file/api-file.module'
import { ApiFile } from '../api-file/entities/api-file.entity'
import { SheetVersionModule } from '../sheet-version/sheet-version.module'
import { Sheet } from '../sheet/entities/sheet.entity'
import { SheetVersion } from '../sheet-version/entities/sheet-version.entity'
import { Compiler } from '../compiler/entities/compiler.entity'
import { SdkGateway } from './sdk.gateway'


@Module({
  imports: [
    ApiFileModule,
    StorageModule,
    SheetVersionModule,
    MikroOrmModule.forFeature([
      ApiFile,
      Sdk,
      Sheet,
      SheetVersion,
      Compiler,
    ]),
  ],
  controllers: [SdkController],
  providers: [SdkService, SdkGateway],
  exports: [SdkService],
})
export class SdkModule {}
