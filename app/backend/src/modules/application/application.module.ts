import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Application } from './entity/application.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([Application]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
