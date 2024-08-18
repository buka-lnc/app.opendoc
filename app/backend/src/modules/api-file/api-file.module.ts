import { Module } from '@nestjs/common'
import { ApiFileController } from './api-file.controller'
import { ApiFileService } from './api-file.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Sheet } from '../sheet/entities/sheet.entity'
import { ApiFile } from './entities/api-file.entity'
import { StorageModule } from '../storage/storage.module'
import { SheetVersion } from '../sheet-version/entities/sheet-version.entity'
import { SheetVersionModule } from '../sheet-version/sheet-version.module'
import { ApiFileSubscriber } from './api-file.subscriber'
import { ApiFileStorageService } from './api-file-storage.service'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Sheet,
      SheetVersion,
      ApiFile,
    ]),
    StorageModule,
    SheetVersionModule,
  ],
  controllers: [ApiFileController],
  providers: [ApiFileService, ApiFileStorageService, ApiFileSubscriber],
  exports: [ApiFileService],
})
export class ApiFileModule {}
