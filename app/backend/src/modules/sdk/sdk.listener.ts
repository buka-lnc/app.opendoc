import { Injectable } from '@nestjs/common'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Sdk } from './entities/sdk.entity'
import { ApiFile } from '../api-file/entities/api-file.entity'


@Injectable()
export class SdkListener {
  constructor(
    @InjectPinoLogger(SdkListener.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,


    @InjectRepository(ApiFile)
    private readonly apiFileRepo: EntityRepository<ApiFile>,

    @InjectRepository(Sdk)
    private readonly sdkRepo: EntityRepository<Sdk>,
  ) {}

  // @OnEvent('api-file.created')
  // async createSdk(event: ApiFileCreatedEvent) {
  //   const apiFile = await this.apiFileRepo.findOne(
  //     {
  //       id: event.apiFile.id,
  //       sheet: {
  //         type: { $in: [SheetType.OPEN_API, SheetType.ASYNC_API] },
  //       },
  //     },
  //     {
  //       populate: ['sheet', 'sheet.application', 'version'],
  //     }
  //   )

  //   if (!apiFile) {
  //     this.logger.error(`apiFile(id: ${event.apiFile.id}) not found`)
  //     return
  //   }

  //   const sheet = apiFile.sheet.get()
  //   const version = apiFile.version.get()
  //   const application = sheet.application.get()

  //   if (sheet.type === SheetType.OPEN_API) {
  //     const core = this.sdkRepo.create({
  //       scope: application.code,
  //       name: sheet.code,
  //       compiler: SdkCompiler.openapiCore,
  //       version,
  //       status: SdkStatus.PENDING,
  //       apiFile: apiFile.id,
  //       sheet: sheet.id,
  //     })
  //     this.em.persist(core)

  //     const react = this.sdkRepo.create({
  //       scope: application.code,
  //       name: `${sheet.code}.react`,
  //       compiler: SdkCompiler.openapiReact,
  //       version,
  //       status: SdkStatus.PENDING,
  //       apiFile: apiFile.id,
  //       sheet: sheet.id,
  //     })
  //     this.em.persist(react)
  //   }

  //   if (sheet.type === SheetType.ASYNC_API) {
  //     const core = this.sdkRepo.create({
  //       scope: application.code,
  //       name: sheet.code,
  //       compiler: SdkCompiler.asyncapiCore,
  //       version,
  //       status: SdkStatus.PENDING,
  //       apiFile: apiFile.id,
  //       sheet: sheet.id,
  //     })
  //     this.em.persist(core)
  //   }


  //   await this.em.flush()
  // }
}
