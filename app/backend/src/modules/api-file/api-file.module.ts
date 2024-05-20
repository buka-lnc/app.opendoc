import { Module } from '@nestjs/common'
import { ApiFileController } from './api-file.controller'
import { ApiFileService } from './api-file.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Sheet } from '../sheet/entity/sheet.entity'
import { ApiFile } from './entities/api-file.entity'
import { StorageModule } from '../storage/storage.module'
import { SheetVersion } from '../sheet-version/entity/sheet-version.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Sheet,
      SheetVersion,
      ApiFile,
    ]),
    StorageModule,
  ],
  controllers: [ApiFileController],
  providers: [ApiFileService],
  exports: [ApiFileService],
})
export class ApiFileModule {}
