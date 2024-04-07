import * as path from 'path'
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from '~/config/app.config'
import { Sdk } from './entity/sdk.entity'
import { InjectRepository } from '@mikro-orm/nestjs'


@Injectable()
export class SdkService {
  constructor(
    @InjectPinoLogger(SdkService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,
  ) {}

  getTarballFilepath(npmPackage: Sdk): string {
    return path.join(path.resolve(this.appConfig.storage), 'registry', npmPackage.scope, npmPackage.name, `${npmPackage.version}.tgz`)
  }

  async querySdksByVersion(documentId: string, version: string): Promise<Sdk[]> {
    const sdks = await this.sdkRepo.find(
      {
        version,
        apiDocument: documentId,
      },
    )

    return sdks
  }

  async querySdkById(sdkId: string): Promise<Sdk> {
    const sdk = await this.sdkRepo.findOneOrFail(sdkId)

    return sdk
  }
}
