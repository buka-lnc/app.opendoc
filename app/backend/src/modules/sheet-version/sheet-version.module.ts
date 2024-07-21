import { Module } from '@nestjs/common'
import { SheetVersionController } from './sheet-version.controller'
import { SheetVersionService } from './sheet-version.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { SheetVersion } from './entities/sheet-version.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      SheetVersion,
    ]),
  ],
  controllers: [SheetVersionController],
  providers: [SheetVersionService],
  exports: [SheetVersionService],
})
export class SheetVersionModule {}
