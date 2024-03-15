import { Module } from '@nestjs/common'
import { RegistryController } from './registry.controller'
import { RegistryService } from './registry.service'
import { RegistryListener } from './registry.listener'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'


@Module({
  imports: [
    MikroOrmModule.forFeature([
      ApiDocumentFile,
    ]),
  ],
  controllers: [RegistryController],
  providers: [RegistryService, RegistryListener],
})
export class RegistryModule {}
