import * as R from 'ramda'
import * as path from 'path'
import { StorageService } from './../storage/storage.service'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Sdk } from './entity/sdk.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Readable } from 'stream'
import { EntityRepository } from '@mikro-orm/mysql'
import { QuerySdksDTO } from './dto/query-sdks.dto'
import { ResponseOfQuerySdksDTO } from './dto/response-of-query-sdks.dto'


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

  private async getTarballFilepath(npmPackage: Sdk): Promise<string> {
    const sheetVersion = await npmPackage.version.loadOrFail()
    return path.join('registry', npmPackage.scope, npmPackage.name, `${sheetVersion.version}.tgz`)
  }

  async uploadTarball(sdk: Sdk, content: Buffer): Promise<void> {
    const filepath = await this.getTarballFilepath(sdk)
    await this.storageService.writeFile(filepath, content)
  }

  async downloadTarball(sdk: Sdk): Promise<Readable> {
    const filepath = await this.getTarballFilepath(sdk)
    return await this.storageService.createStream(filepath)
  }

  async removeTarball(sdk: Sdk): Promise<void> {
    const filepath = await this.getTarballFilepath(sdk)
    await this.storageService.removeFile(filepath)
  }

  async querySdks(dto: QuerySdksDTO): Promise<ResponseOfQuerySdksDTO> {
    const qb = this.sdkRepo.createQueryBuilder('sdk')

    if (dto.sheetId) {
      void qb.andWhere({ sheet: dto.sheetId })
    }

    if (dto.version) {
      void qb.andWhere({ version: { version: dto.version } })
    }

    if (!R.isNil(dto.offset)) {
      void qb
        .offset(dto.offset)
        .limit(dto.limit || 10)
    }

    const [sdks, count] = await qb.getResultAndCount()

    return {
      results: sdks,
      pagination: {
        total: count,
        limit: dto.limit || 10,
        offset: dto.offset || -1,
      },
    }
  }

  async querySdk(sdkId: string): Promise<Sdk> {
    const sdk = await this.sdkRepo.findOneOrFail(sdkId)

    return sdk
  }
}
