import { Module } from '@nestjs/common'
import { SheetVersionController } from './sheet-version.controller'
import { SheetVersionService } from './sheet-version.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { SheetVersion } from './entity/sheet-version.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      SheetVersion,
    ]),
  ],
  controllers: [SheetVersionController],
  providers: [SheetVersionService],
})
export class SheetVersionModule {}
