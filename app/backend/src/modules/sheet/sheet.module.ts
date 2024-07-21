import { Module } from '@nestjs/common'
import { SheetController } from './sheet.controller'
import { SheetService } from './sheet.service'
import { ApiFileModule } from '../api-file/api-file.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Application } from '../application/entities/application.entity'
import { Sheet } from './entities/sheet.entity'
import { ApiFile } from '../api-file/entities/api-file.entity'
import { SheetSynchronizeService } from './sheet-synchronize.service'
import { SheetPullCrontab } from './entities/sheet-pull-crontab.entity'
import { SheetVersionModule } from '../sheet-version/sheet-version.module'


@Module({
  imports: [
    ApiFileModule,
    SheetVersionModule,
    MikroOrmModule.forFeature([
      Application,
      Sheet,
      SheetPullCrontab,
      ApiFile,
    ]),
  ],
  controllers: [SheetController],
  providers: [SheetService, SheetSynchronizeService],
  exports: [SheetService],
})
export class SheetModule {}
