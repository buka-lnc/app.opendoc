import { StorageService } from './../storage/storage.service'
import * as path from 'path'
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Sdk } from './entity/sdk.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Readable } from 'stream'


@Injectable()
export class SdkService {
  constructor(
    @InjectPinoLogger(SdkService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly storageService: StorageService,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,
  ) {}

  private getTarballFilepath(npmPackage: Sdk): string {
    return path.join('registry', npmPackage.scope, npmPackage.name, `${npmPackage.version}.tgz`)
  }

  async uploadTarball(sdk: Sdk, content: Buffer): Promise<void> {
    const filepath = this.getTarballFilepath(sdk)
    await this.storageService.writeFile(filepath, content)
  }

  async downloadTarball(sdk: Sdk): Promise<Readable> {
    const filepath = this.getTarballFilepath(sdk)
    return await this.storageService.createStream(filepath)
  }

  async removeTarball(sdk: Sdk): Promise<void> {
    const filepath = this.getTarballFilepath(sdk)
    await this.storageService.removeFile(filepath)
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
