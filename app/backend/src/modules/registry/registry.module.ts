import { Module } from '@nestjs/common'
import { RegistryController } from './registry.controller'
import { RegistryService } from './registry.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { SdkModule } from '../sdk/sdk.module'
import { Sdk } from '../sdk/entity/sdk.entity'


@Module({
  imports: [
    SdkModule,
    MikroOrmModule.forFeature([
      Sdk,
    ]),
  ],
  controllers: [RegistryController],
  providers: [
    RegistryService,
  ],
})
export class RegistryModule {}
