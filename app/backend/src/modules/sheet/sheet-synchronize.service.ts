import { EnsureRequestContext, EntityManager, MikroORM, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ApiFileService } from '../api-file/api-file.service'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { Cron } from '@nestjs/schedule'
import { SheetMode } from './constants/sheet-mode.enum'
import { SheetPullCrontab } from './entities/sheet-pull-crontab.entity'
import { request } from 'keq'
import { SheetType } from './constants/sheet-type.enum'
import { SheetRepository } from './repository/sheet.repository'
import { ForeignFile } from '../api-file/dto/foreign-file.dto'


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

    private readonly sheetRepo: SheetRepository,
  ) {}

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
      crontab.updatedAt = new Date()
      this.em.persist(crontab)
    }

    await this.em.flush()
  }

  async synchronize(crontab: SheetPullCrontab): Promise<void> {
    if (!wrap(crontab).isInitialized()) {
      await wrap(crontab).init()
    }

    const sheet = await crontab.sheet.loadOrFail({
      populate: ['application'],
    })
    if (sheet.mode !== SheetMode.PULL) return

    let res
    try {
      res = await request
        .get(crontab.url)
        .option('resolveWithFullResponse')
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(`无法获取 API 文档: ${err.message}`)
      }

      throw err
    }

    const buf = Buffer.from(await res.arrayBuffer())

    let foreignFiles: ForeignFile[]
    if (sheet.type === SheetType.OPEN_API) {
      try {
        JSON.parse(buf.toString())
      } catch (err) {
        throw new BadRequestException('不是有效的 OpenAPI 文档')
      }

      foreignFiles = [{
        path: 'openapi.json',
        raw: buf,
      }]
    } else if (sheet.type === SheetType.ASYNC_API) {
      try {
        JSON.parse(buf.toString())
      } catch (err) {
        throw new BadRequestException('不是有效的 AsyncAPI 文档')
      }

      foreignFiles = [{
        path: 'asyncapi.json',
        raw: buf,
      }]
    } else if (sheet.type === SheetType.MARKDOWN) {
      foreignFiles = await this.apiFileService.decompress(buf)
    } else {
      throw new BadRequestException('不支持的 API 文档类型')
    }

    const sheetVersion = await this.sheetRepo.bumpVersion(sheet, foreignFiles, 'patch')
    this.em.persist(sheetVersion)
    this.em.persist(sheet)
  }
}
