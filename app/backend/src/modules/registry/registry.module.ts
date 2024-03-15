import { Module } from '@nestjs/common'
import { RegistryController } from './registry.controller'
import { RegistryService } from './registry.service'
import { RegistryListener } from './registry.listener'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { NpmPackage } from './entity/npm-package.entity'
import { BuildTask } from './entity/build-task.entity'
import { PublishPackageService } from './publish-package.service'
import { ApiDocumentFileModule } from '../api-document-file/api-document-file.module'


@Module({
  imports: [
    ApiDocumentFileModule,
    MikroOrmModule.forFeature([
      ApiDocumentFile,
      NpmPackage,
      BuildTask,
    ]),
  ],
  controllers: [RegistryController],
  providers: [
    RegistryService,
    RegistryListener,
    PublishPackageService,
  ],
})
export class RegistryModule {}
