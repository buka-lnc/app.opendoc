import { EnsureRequestContext, EntityManager, MikroORM, wrap } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ApiFileService } from '../api-file/api-file.service'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { Cron } from '@nestjs/schedule'
import { SheetMode } from './constants/sheet-mode.enum'
import { SheetPullCrontab } from './entity/sheet-pull-crontab.entity'
import { request } from 'keq'
import { SheetType } from './constants/sheet-type.enum'
import { CreateSheetPullCrontabDTO } from './dto/create-sheet-pull-crontab.dto'
import { Sheet } from './entity/sheet.entity'


@Injectable()
export class SheetSynchronizeService {
  constructor(
    @InjectPinoLogger(SheetSynchronizeService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly apiFileService: ApiFileService,

    @InjectRepository(SheetPullCrontab)
    private readonly sheetPullCrontabRepo: EntityRepository<SheetPullCrontab>,

    @InjectRepository(Sheet)
    private readonly sheetRepo: EntityRepository<Sheet>,
  ) {}

  async create(dto: CreateSheetPullCrontabDTO): Promise<SheetPullCrontab> {
    const pullCrontab = this.sheetPullCrontabRepo.create({
      sheet: dto.sheet,
      url: dto.url,
    })

    await this.em.persistAndFlush(pullCrontab)
    await this.synchronize(pullCrontab)
    return pullCrontab
  }

  @Cron('0 */10 * * * *')
  @EnsureRequestContext()
  async synchronizeAll(): Promise<void> {
    const crontabs = await this.sheetPullCrontabRepo.find(
      {
        sheet: { mode: SheetMode.PULL },
      },
      {
        limit: 10,
        orderBy: { updatedAt: 'ASC' },
      }
    )

    for (const crontab of crontabs) {
      await this.synchronize(crontab)
      wrap(crontab).toReference()
      crontab.updatedAt = new Date()
      this.em.persist(crontab)
    }

    await this.em.flush()
  }

  async synchronize(crontab: SheetPullCrontab): Promise<void> {
    if (!wrap(crontab).isInitialized()) {
      await wrap(crontab).init()
    }

    const sheet = await crontab.sheet.loadOrFail()

    if (sheet.mode !== SheetMode.PULL) return


    const res = await request
      .get(crontab.url)
      .option('resolveWithFullResponse')

    const buf = Buffer.from(await res.arrayBuffer())

    if (sheet.type === SheetType.OPEN_API) {
      await this.apiFileService.create({
        sheet,
        files: [{
          path: 'openapi.json',
          raw: buf,
        }],
      })
    } else if (sheet.type === SheetType.ASYNC_API) {
      await this.apiFileService.create({
        sheet: sheet,
        files: [{
          path: 'asyncapi.json',
          raw: buf,
        }],
      })
    } else if (sheet.type === SheetType.MARKDOWN) {
      await this.apiFileService.createByTgz({
        sheet,
        raw: buf,
      })
    }
  }
}
