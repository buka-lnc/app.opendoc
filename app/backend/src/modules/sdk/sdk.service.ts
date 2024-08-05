import * as R from 'ramda'
import { StorageService } from './../storage/storage.service'
import { EnsureRequestContext, EntityManager, MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Sdk } from './entities/sdk.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { QuerySdksDTO } from './dto/query-sdks.dto'
import { ResponseOfQuerySdksDTO } from './dto/response-of-query-sdks.dto'
import { SheetVersionService } from '../sheet-version/sheet-version.service'
import { Sheet } from '../sheet/entities/sheet.entity'
import { SheetVersion } from '../sheet-version/entities/sheet-version.entity'
import { SdkStatus } from './constant/sdk-status'
import { CreateSdkDTO } from './dto/create-sdk.dto'
import { Compiler } from '../compiler/entities/compiler.entity'
import { OnEvent } from '@nestjs/event-emitter'


@Injectable()
export class SdkService {
  constructor(
    @InjectPinoLogger(SdkService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly storageService: StorageService,
    private readonly sheetVersionService: SheetVersionService,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,

    @InjectRepository(Sheet)
    private readonly sheetRepo: EntityRepository<Sheet>,

    @InjectRepository(SheetVersion)
    private readonly sheetVersionRepo: EntityRepository<SheetVersion>,

    @InjectRepository(Compiler)
    private readonly compilerRepo: EntityRepository<Compiler>,
  ) {}

  // private async getTarballFilepath(npmPackage: Sdk): Promise<string> {
  //   const sheetVersion = await npmPackage.version.loadOrFail()
  //   return path.join('registry', npmPackage.scope, npmPackage.name, `${sheetVersion.version}.tgz`)
  // }

  // async uploadTarball(sdk: Sdk, content: Buffer): Promise<void> {
  //   const filepath = await this.getTarballFilepath(sdk)
  //   await this.storageService.writeFile(filepath, content)
  // }

  // async downloadTarball(sdk: Sdk): Promise<Readable> {
  //   const filepath = await this.getTarballFilepath(sdk)
  //   return await this.storageService.createStream(filepath)
  // }

  // async removeTarball(sdk: Sdk): Promise<void> {
  //   const filepath = await this.getTarballFilepath(sdk)
  //   await this.storageService.removeFile(filepath)
  // }

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

  @OnEvent('create-sdk')
  @EnsureRequestContext()
  async create(dto: CreateSdkDTO): Promise<Sdk> {
    const sheet = await this.sheetRepo.findOneOrFail(dto.sheet.id)

    const version = await this.sheetVersionRepo.findOneOrFail({
      major: dto.version.major,
      minor: dto.version.minor,
      patch: dto.version.patch,
      tag: dto.version.tag,
      prerelease: dto.version.prerelease,
    })

    const compiler = await this.compilerRepo.findOneOrFail(dto.compiler.id)


    const sdk = this.sdkRepo.create({
      sheet,
      version,
      compiler,
      name: dto.name,
      status: SdkStatus.PENDING,
    })

    await this.em.persistAndFlush(sdk)
    return sdk
  }
}
