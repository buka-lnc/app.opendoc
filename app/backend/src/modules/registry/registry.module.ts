import { Module } from '@nestjs/common'
import { RegistryController } from './registry.controller'
import { RegistryService } from './registry.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { ApiDocumentFileModule } from '../api-document-file/api-document-file.module'
import { SdkModule } from '../sdk/sdk.module'
import { Sdk } from '../sdk/entity/sdk.entity'


@Module({
  imports: [
    ApiDocumentFileModule,
    SdkModule,
    MikroOrmModule.forFeature([
      ApiDocumentFile,
      Sdk,
    ]),
  ],
  controllers: [RegistryController],
  providers: [
    RegistryService,
  ],
})
export class RegistryModule {}
