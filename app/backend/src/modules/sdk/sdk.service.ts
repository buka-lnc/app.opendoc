import * as R from 'ramda'
import { StorageService } from './../storage/storage.service'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Sdk } from './entities/sdk.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { QuerySdksDTO } from './dto/query-sdks.dto'
import { ResponseOfQuerySdksDTO } from './dto/response-of-query-sdks.dto'
import { SheetVersionService } from '../sheet-version/sheet-version.service'
import { EventEmitter2 } from '@nestjs/event-emitter'


@Injectable()
export class SdkService {
  constructor(
    @InjectPinoLogger(SdkService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly eventEmitter: EventEmitter2,
    private readonly storageService: StorageService,
    private readonly sheetVersionService: SheetVersionService,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,
  ) {}


  async querySdks(dto: QuerySdksDTO): Promise<ResponseOfQuerySdksDTO> {
    const qb = this.sdkRepo.createQueryBuilder('sdk')
      .leftJoinAndSelect('sdk.version', 'version')

    if (dto.sheetId) {
      void qb.andWhere({ sheet: dto.sheetId })
    }

    if (dto.version) {
      const version = this.sheetVersionService.parse(dto.version)

      void qb
        .andWhere('version.major = ?', [version.major])
        .andWhere('version.minor = ?', [version.minor])
        .andWhere('version.patch = ?', [version.patch])
        .andWhere('version.tag = ?', [version.tag])
        .andWhere('version.prerelease = ?', [version.prerelease])
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
    const sdk = await this.sdkRepo.findOneOrFail(
      sdkId,
      { populate: ['version'] },
    )

    return sdk
  }
}
