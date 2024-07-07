import * as R from 'ramda'
import { SheetSynchronizeService } from './sheet-synchronize.service'
import { EnsureRequestContext, EntityManager, MikroORM, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from '~/config/app.config'
import { ApiFileService } from '../api-file/api-file.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { Sheet } from './entity/sheet.entity'
import { Application } from '../application/entity/application.entity'
import { RegisterSheetDTO } from './dto/register-sheet.dto'
import { CreateSheetDTO } from './dto/create-sheet.dto'
import { SheetMode } from './constants/sheet-mode.enum'
import { QuerySheetsDTO } from './dto/query-sheets.dto'
import { ResponseOfQuerySheetsDTO } from './dto/response-of-query-sheets.dto'
import { Sdk } from '../sdk/entity/sdk.entity'
import { SheetCreatedEvent } from './events/sheet-created.event'
import { ApiFile } from '../api-file/entities/api-file.entity'
import { UpdateSheetDTO } from './dto/update-sheet.dto'
import { SheetPullCrontab } from './entity/sheet-pull-crontab.entity'
import { SheetVersionService } from '../sheet-version/sheet-version.service'


@Injectable()
export class SheetService {
  constructor(
    @InjectPinoLogger(SheetService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private eventEmitter: EventEmitter2,
    private readonly apiFileService: ApiFileService,
    private readonly sheetSynchronizeService: SheetSynchronizeService,
    private readonly sheetVersionService: SheetVersionService,

    @InjectRepository(Sheet)
    private readonly sheetRepo: EntityRepository<Sheet>,

    @InjectRepository(SheetPullCrontab)
    private readonly sheetPullCrontabRepo: EntityRepository<SheetPullCrontab>,

    @InjectRepository(Application)
    private readonly applicationRepo: EntityRepository<Application>,

    @InjectRepository(ApiFile)
    private readonly apiFileRepo: EntityRepository<ApiFile>,
  ) {}

  @EnsureRequestContext()
  async register(dto: RegisterSheetDTO): Promise<Sheet> {
    const application = await this.applicationRepo.findOneOrFail({
      code: dto.applicationCode,
    })

    let sheet: Sheet | null

    sheet = await this.em.findOne(Sheet, {
      code: dto.sheetCode,
    })

    if (!sheet) {
      sheet = new Sheet()
      sheet.type = dto.sheetType
      sheet.code = dto.sheetCode
      sheet.application = wrap(application).toReference()
      sheet.mode = dto.sheetMode || SheetMode.PUSH

      if (dto.sheetTitle) sheet.title = dto.sheetTitle
      if (dto.sheetOrder) sheet.order = dto.sheetOrder

      await this.em.persistAndFlush(sheet)

      this.eventEmitter.emit(
        'sheet.created',
        new SheetCreatedEvent(sheet)
      )
    } else {
      if (dto.sheetTitle) sheet.title = dto.sheetTitle
      if (dto.sheetOrder) sheet.order = dto.sheetOrder
      await this.em.persistAndFlush(sheet)
    }


    if (dto.sheetPullCrontabUrl) {
      await this.sheetSynchronizeService.create({
        url: dto.sheetPullCrontabUrl,
        sheet: sheet,
      })
    }

    if (dto.apiFileRaw) {
      await this.apiFileService.createByTgz({
        raw: dto.apiFileRaw,
        sheet,
        version: dto.apiFileVersionTag ? { tag: dto.apiFileVersionTag } : undefined,
      })
    }

    return sheet
  }

  async create(dto: CreateSheetDTO): Promise<Sheet> {
    const application = await this.applicationRepo.findOneOrFail(
      'id' in dto.application
        ? { id: dto.application.id }
        : { code: dto.application.code }
    )

    const sheet = this.sheetRepo.create({
      application,
      title: dto.title,
      type: dto.type,
      code: dto.code,
      mode: dto.mode,
      order: dto.order || 1,
    })

    await this.em.persistAndFlush(sheet)

    this.eventEmitter.emit(
      'sheet.created',
      new SheetCreatedEvent(sheet)
    )

    if (dto.pullCrontab) {
      await this.sheetSynchronizeService.create({
        url: dto.pullCrontab.url,
        sheet,
      })
    }

    return sheet
  }

  async update(sheetId: string, dto: UpdateSheetDTO): Promise<Sheet> {
    const sheet = await this.sheetRepo.findOneOrFail(sheetId)

    if (dto.title) sheet.title = dto.title
    if (dto.order) sheet.order = dto.order
    if (dto.mode) sheet.mode = dto.mode
    if (dto.type) sheet.type = dto.type
    if (dto.pullCrontab) {
      const pullCrontab = this.sheetPullCrontabRepo.create({
        url: dto.pullCrontab.url,
        sheet,
      })
      this.em.persist(pullCrontab)
    }

    this.em.persist(sheet)

    await this.em.flush()
    return sheet
  }

  async remove(sheetId: string) {
    const sheet = await this.sheetRepo.find(
      { id: sheetId },
      {
        populate: [
          'pullCrontab',
          'versions',
          'apiFiles',
          'apiFiles.sdks',
          'apiFiles.sdks.sdkPublishLock',
        ],
      }
    )

    if (!sheet) return
    await this.em.removeAndFlush(sheet)
  }

  async sync(sheetId: string): Promise<void> {
    const crontab = await this.sheetPullCrontabRepo.findOneOrFail({
      sheet: { id: sheetId },
    })

    await this.sheetSynchronizeService.synchronize(crontab)
  }

  async querySheetById(sheetId: string): Promise<Sheet> {
    return this.sheetRepo.findOneOrFail(sheetId)
  }

  async querySheets(dto: QuerySheetsDTO): Promise<ResponseOfQuerySheetsDTO> {
    const qb = this.sheetRepo.createQueryBuilder('sheet')
      .select('*')
      .leftJoinAndSelect('sheet.pullCrontab', 'pullCrontab')

    if (dto.title) {
      void qb.andWhere({ title: dto.title })
    }

    if (dto.type) {
      void qb.andWhere({ type: dto.type })
    }

    if (!R.isNil(dto.offset)) {
      void qb
        .limit(dto.limit || 10)
        .offset(dto.offset)
    }

    if (dto.applicationId) {
      void qb.andWhere({ application: { id: dto.applicationId } })
    }

    const [results, total] = await qb.getResultAndCount()

    return {
      results,
      pagination: {
        limit: dto.limit || 10,
        offset: dto.offset || -1,
        total,
      },
    }
  }

  async queryApiFile(sheetId: string, version: string, path: string) : Promise<ApiFile> {
    const sheetVersion = this.sheetVersionService.parse(version)
    return await this.apiFileRepo.findOneOrFail({
      sheet: { id: sheetId },
      version: sheetVersion,
      path,
    })
  }

  async querySdkBySheetId(sheetId: string): Promise<Sdk[]> {
    const sheet = await this.sheetRepo.findOneOrFail(
      {
        id: sheetId,
      },
      { populate: ['sdks'] }
    )

    return sheet.sdks.getItems()
  }
}
