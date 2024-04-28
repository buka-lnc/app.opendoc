import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Application } from './entity/application.entity'
import { ForbiddenApplicationCode } from './entity/forbidden-application-code.entity'
import { ForbiddenApplicationCodeController } from './forbidden-application-code.controller'
import { ForbiddenApplicationCodeService } from './forbidden-application-code.service'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      Application,
      ForbiddenApplicationCode,
    ]),
  ],
  controllers: [ApplicationController, ForbiddenApplicationCodeController],
  providers: [ApplicationService, ForbiddenApplicationCodeService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
