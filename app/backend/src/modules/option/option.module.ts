import { Module } from '@nestjs/common'
import { OptionController } from './option.controller'
import { OptionService } from './option.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Option } from './entities/option.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Option,
    ]),
  ],
  controllers: [OptionController],
  providers: [OptionService],
  exports: [OptionService],
})
export class OptionModule {}
