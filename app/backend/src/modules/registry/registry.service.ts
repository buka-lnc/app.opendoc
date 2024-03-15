import { EntityManager, MikroORM } from '@mikro-orm/core'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ApiDocumentFile } from '../api-document-file/entities/api-document-file.entity'
import { NpmPackage } from './entity/npm-package.entity'
import { BuildTask } from './entity/build-task.entity'


@Injectable()
export class RegistryService {
  constructor(
    @InjectPinoLogger(RegistryService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,


    @InjectRepository(ApiDocumentFile)
    private readonly apiDocumentFileRepo: EntityRepository<ApiDocumentFile>,

    @InjectRepository(NpmPackage)
    private readonly npmPackageRepo: EntityRepository<NpmPackage>,

    @InjectRepository(BuildTask)
    private readonly buildTaskRepo: EntityRepository<BuildTask>,
  ) {}

  getPackageMetadata() {
  }

  downloadPackage() {

  }
}
