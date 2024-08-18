import * as path from 'path'
import * as R from 'ramda'
import * as fs from 'fs-extra'
import compressing from 'compressing'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AppConfig } from '~/config/app.config'
import { ApiFileService } from '../api-file/api-file.service'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { Sheet } from './entities/sheet.entity'
import { RegisterSheetDTO } from './dto/register-sheet.dto'
import { CreateSheetDTO } from './dto/create-sheet.dto'
import { QuerySheetsDTO } from './dto/query-sheets.dto'
import { ResponseOfQuerySheetsDTO } from './dto/response-of-query-sheets.dto'
import { Sdk } from '../sdk/entities/sdk.entity'
import { ApiFile } from '../api-file/entities/api-file.entity'
import { UpdateSheetDTO } from './dto/update-sheet.dto'
import { SheetPullCrontab } from './entities/sheet-pull-crontab.entity'
import { SheetVersionService } from '../sheet-version/sheet-version.service'
import { SheetRepository } from './repository/sheet.repository'
import { ApiFileRepository } from '../api-file/repository/api-file.repository'
import { SheetSynchronizeService } from './sheet-synchronize.service'
import { ApplicationRepository } from '../application/repository/application.repository'


@Injectable()
export class SheetService {
  constructor(
    @InjectPinoLogger(SheetService.name)
    private readonly logger: PinoLogger,

    private readonly appConfig: AppConfig,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly apiFileService: ApiFileService,
    private readonly sheetSynchronizeService: SheetSynchronizeService,
    private readonly sheetVersionService: SheetVersionService,

    private readonly applicationRepo: ApplicationRepository,
    private readonly sheetRepo: SheetRepository,
    private readonly apiFileRepo: ApiFileRepository,

    @InjectRepository(SheetPullCrontab)
    private readonly sheetPullCrontabRepo: EntityRepository<SheetPullCrontab>,
  ) {}


  async register(dto: RegisterSheetDTO): Promise<Sheet> {
    const application = await this.applicationRepo.register({ code: dto.applicationCode })

    const sheet = await this.sheetRepo.register({
      application,
      code: dto.sheetCode,
      type: dto.sheetType,
      title: dto.sheetTitle,
      mode: dto.sheetMode,
      order: dto.sheetOrder,
    })

    this.em.persist(sheet)

    if (dto.sheetPullCrontabUrl) {
      sheet.pullCrontab = this.sheetPullCrontabRepo.create({
        url: dto.sheetPullCrontabUrl,
        sheet,
      })
    }

    const files = dto.apiFileRaw ? await this.apiFileService.decompress(dto.apiFileRaw) : undefined
    if (files && await this.sheetRepo.needBump(sheet, files)) {
      const version = await this.sheetRepo.bumpVersion(sheet, files, 'patch', dto.apiFileVersionTag)
      this.em.persist(version)
    }

    this.em.persist(sheet)
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

    if (dto.pullCrontab) {
      sheet.pullCrontab = this.sheetPullCrontabRepo.create({
        url: dto.pullCrontab.url,
        sheet,
      })

      await this.sheetSynchronizeService.synchronize(sheet.pullCrontab)
    }

    this.em.persist(sheet)
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

    return sheet
  }

  async remove(sheetId: string) {
    const sheet = await this.sheetRepo.find(
      { id: sheetId },
      {
        populate: [
          'pullCrontab',
          'sdks',
          'versions',
          'apiFiles',
        ],
      }
    )

    if (!sheet) return
    this.em.remove(sheet)
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

  async getApiFilesRaw(sheetId: string, version: string): Promise<Buffer> {
    const sheet = await this.sheetRepo.findOneOrFail(sheetId)
    await sheet.versions.init()

    if (!sheet.versions.exists((item) => item.string === version)) {
      throw new BadRequestException('sheet version not exists')
    }

    const apiFiles = await this.apiFileRepo.find({
      sheet: { id: sheetId },
      version: this.sheetVersionService.parse(version),
    })

    const { temporaryDirectory } = (await import('tempy'))
    const dir = temporaryDirectory()

    const { getStreamAsBuffer } = (await import('get-stream'))

    // 在临时文件夹构造apiFile目录结构
    await Promise.all(apiFiles.map(async (apiFile) => {
      const stream = await this.apiFileService.queryApiFileRaw(apiFile.id)
      const buf = await getStreamAsBuffer(stream)

      const filepath = path.join(dir, apiFile.path)
      await fs.writeFile(filepath, buf)
    }))

    const tgzStream = new compressing.tgz.Stream()
    tgzStream.addEntry(dir, { ignoreBase: true })

    const buf = await getStreamAsBuffer(tgzStream)

    return buf
  }
}
