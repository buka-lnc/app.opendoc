import { ApiFileStorageService } from './api-file-storage.service'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import semver from 'semver'
import * as R from 'ramda'
import * as fs from 'fs-extra'
import compressing from 'compressing'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Readable } from 'stream'
import { ApiFile } from './entities/api-file.entity'
import { QueryApiFilesDTO } from './dto/query-api-files.dto'
import { PathScurry } from 'path-scurry'
import { CreateApiFilesDTO } from './dto/create-api-files.dto'
import { CreateApiFileByTgzDTO } from './dto/create-api-file-by-tgz.dto'
import { ForeignFile } from './dto/foreign-file.dto'
import { ResponseOfQueryApiFilesDTO } from './dto/response-of-query-api-files.dto'
import { SheetVersionService } from '../sheet-version/sheet-version.service'
import { SheetRepository } from '../sheet/repository/sheet.repository'
import { SheetVersionRepository } from '../sheet-version/repository/sheet-version.repository'
import { ApiFileRepository } from './repository/api-file.repository'


@Injectable()
export class ApiFileService {
  constructor(
    @InjectPinoLogger(ApiFileService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly sheetVersionService: SheetVersionService,
    private readonly apiFileStorageService: ApiFileStorageService,

    private readonly sheetRepo: SheetRepository,
    private readonly sheetVersionRepo: SheetVersionRepository,
    private readonly apiFileRepo: ApiFileRepository,
  ) {}


  /**
   * Decompress tgz file buffer to files
   * @param raw the tgz file buffer
   */
  async decompress(raw: Buffer): Promise<ForeignFile[]> {
    const { temporaryDirectory } = (await import('tempy'))

    const dir = temporaryDirectory()

    await compressing.tgz.uncompress(raw, dir)

    const pw = new PathScurry(dir, {
      nocase: false,
    })

    const pwFiles = await pw.walk({
      filter: (file) => file.isFile(),
    })

    return await Promise.all(pwFiles.map(async (file): Promise<ForeignFile> => ({
      path: file.relative(),
      raw: await fs.readFile(file.fullpath()),
    })))
  }

  async createByTgz(dto: CreateApiFileByTgzDTO): Promise<ApiFile[]> {
    const fileRaws = await this.decompress(dto.raw)
    const apiFiles = this.create({ ...dto, files: fileRaws })
    return apiFiles
  }


  create(dto: CreateApiFilesDTO): ApiFile[] {
    const apiFiles = dto.files.map((file) => {
      const apiFile = this.apiFileRepo.create({
        path: file.path,
        sheet: dto.sheet,
        version: dto.version,
        raw: file.raw,
      })

      this.em.persist(apiFile)

      return apiFile
    })

    return apiFiles
  }

  async queryApiFiles(dto: QueryApiFilesDTO): Promise<ResponseOfQueryApiFilesDTO> {
    const qb = this.apiFileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.version', 'version')

    if (dto.sheetId) {
      void qb.andWhere({ sheet: { id: dto.sheetId } })
    }

    if (dto.version) {
      const version = this.sheetVersionService.parse(dto.version)
      void qb.andWhere({ version: version })
    }

    if (!R.isNil(dto.offset)) {
      void qb
        .offset(dto.offset)
        .limit(dto.limit || 10)
    }


    const [files, total] = await qb.getResultAndCount()


    const results = files.sort((f1, f2) => semver.rcompare(
      f1.version.getEntity().string,
      f2.version.getEntity().string,
    ))

    return {
      results,
      pagination: {
        total,
        limit: dto.limit || 10,
        offset: dto.offset || -1,
      },
    }
  }

  private async queryRaw(apiFile: ApiFile): Promise<Readable> {
    return this.apiFileStorageService.createStream(apiFile)
  }

  async queryApiFile(apiFileId: string): Promise<ApiFile> {
    return this.apiFileRepo.findOneOrFail(apiFileId)
  }

  async queryApiFileRaw(apiFileId: string): Promise<Readable> {
    const apiFile = await this.em.findOneOrFail(ApiFile, apiFileId)
    return this.queryRaw(apiFile)
  }

  async queryApiFileByVersion(apiFileId: string, version: string): Promise<ApiFile> {
    const sheet = this.sheetRepo.getReference(apiFileId)
    const apiFile = await this.em.findOneOrFail(ApiFile, {
      sheet,
      version: this.sheetVersionService.parse(version),
    })

    return apiFile
  }

  async queryApiFileByTag(apiFileId: string, tag: string | undefined): Promise<ApiFile> {
    const sheet = this.sheetRepo.getReference(apiFileId)
    const apiFile = await this.apiFileRepo.findOneOrFail({
      sheet,
      version: { tag },
    })

    return apiFile
  }

  async deleteApiFile(apiFileId: string): Promise<void> {
    const apiFile = await this.apiFileRepo.findOne(apiFileId)
    if (!apiFile) return

    this.em.remove(apiFile)
  }
}
