import { Module } from '@nestjs/common'
import { SheetController } from './sheet.controller'
import { SheetService } from './sheet.service'
import { ApiFileModule } from '../api-file/api-file.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { SheetSynchronizeService } from './sheet-synchronize.service'
import { SheetPullCrontab } from './entities/sheet-pull-crontab.entity'
import { SheetVersionModule } from '../sheet-version/sheet-version.module'
import { Sheet } from './entities/sheet.entity'
import { ApiFile } from '../api-file/entities/api-file.entity'
import { Application } from '../application/entities/application.entity'
import { SheetPullCrontabSubscriber } from './sheet-pull-crontab.subscriber'
import { SheetSubscriber } from './sheet.subscriber'


@Module({
  imports: [
    ApiFileModule,
    SheetVersionModule,
    MikroOrmModule.forFeature([
      SheetPullCrontab,
      Sheet,
      ApiFile,
      Application,
    ]),
  ],
  controllers: [SheetController],
  providers: [SheetService, SheetSynchronizeService, SheetSubscriber, SheetPullCrontabSubscriber],
  exports: [SheetService],
})
export class SheetModule {}
