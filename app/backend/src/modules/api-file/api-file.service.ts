import { EntityManager, MikroORM } from '@mikro-orm/core'
import semver from 'semver'
import * as R from 'ramda'
import * as fs from 'fs-extra'
import * as path from 'path'
import compressing from 'compressing'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@mikro-orm/mysql'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { StorageService } from '../storage/storage.service'
import { Readable } from 'stream'
import { CacheService } from '../storage/cache.service'
import { Sheet } from '../sheet/entity/sheet.entity'
import { ApiFile } from './entities/api-file.entity'
import { ApiFileCreatedEvent } from './events/api-file-created.event'
import { ApiFileDeletedEvent } from './events/api-file-deleted.event'
import { QueryApiFilesDTO } from './dto/query-api-files.dto'
import { PathScurry } from 'path-scurry'
import { CreateApiFilesDTO } from './dto/create-api-files.dto'
import { CreateApiFileByTgzDTO } from './dto/create-api-file-by-tgz.dto'
import { FileRawDTO } from './dto/file-raw.dto'
import { SheetVersion } from '../sheet-version/entity/sheet-version.entity'
import { ResponseOfQueryApiFilesDTO } from './dto/response-of-query-api-files.dto'
import { SheetVersionService } from '../sheet-version/sheet-version.service'


@Injectable()
export class ApiFileService {
  constructor(
    @InjectPinoLogger(ApiFileService.name)
    private readonly logger: PinoLogger,

    private eventEmitter: EventEmitter2,
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly storageService: StorageService,
    private readonly cacheService: CacheService,
    private readonly sheetVersionService: SheetVersionService,

    @InjectRepository(Sheet)
    private readonly sheetRepo: EntityRepository<Sheet>,

    @InjectRepository(SheetVersion)
    private readonly sheetVersionRepo: EntityRepository<SheetVersion>,

    @InjectRepository(ApiFile)
    private readonly apiFileRepo: EntityRepository<ApiFile>,
  ) {}


  async getFilepath(file: ApiFile): Promise<string> {
    const sheetVersion = await file.version.loadOrFail()
    return path.join('api-file', file.sheet.id, sheetVersion.version, file.path)
  }

  async createByTgz(dto: CreateApiFileByTgzDTO): Promise<ApiFile[]> {
    const { temporaryDirectory } = (await import('tempy'))
    const dir = temporaryDirectory()

    await compressing.tgz.uncompress(dto.raw, dir)

    const pw = new PathScurry(dir, {
      nocase: false,
    })

    const pwFiles = await pw.walk({
      filter: (file) => file.isFile(),
    })

    const fileRaws = await Promise.all(pwFiles.map(async (file): Promise<FileRawDTO> => ({
      path: file.relative(),
      raw: await fs.readFile(file.fullpath()),
    })))


    const apiFiles = await this.create({
      ...dto,
      files: fileRaws,
    })

    return apiFiles
  }

  async hasDiff(version: SheetVersion, files: FileRawDTO[]): Promise<boolean> {
    const revisionHash = (await import('rev-hash')).default

    const apiFilesOfVersion = await version.apiFiles.loadItems()
    if (apiFilesOfVersion.length !== files.length) return true

    for (const file of files) {
      const apiFile = apiFilesOfVersion.find((f) => f.path === file.path)
      // 新版文件在当前版本中不存在
      if (!apiFile) return true
      // 文件hash不一致
      if (apiFile.hash !== revisionHash(file.raw)) return true
    }

    // 当前版本的文件在新版本中不存在
    if (apiFilesOfVersion.some((f) => !files.find((file) => file.path === f.path))) return true

    return false
  }

  async create(dto: CreateApiFilesDTO): Promise<ApiFile[]> {
    const revisionHash = (await import('rev-hash')).default
    const sheet = await this.sheetRepo.findOneOrFail({ id: dto.sheet.id })

    const maxSheetVersion = await this.sheetVersionService.findMaxSheetVersion(sheet)
    console.log('🚀 ~ ApiFileService ~ create ~ maxSheetVersion:', maxSheetVersion)

    if (maxSheetVersion && !(await this.hasDiff(maxSheetVersion, dto.files))) {
      this.logger.info('api file hash is same to latest, skip')
      return maxSheetVersion.apiFiles.getItems()
    }

    this.logger.info('api file hash is different, persisting')

    const newSheetVersion = await this.sheetVersionService.bumpSheetVersion(sheet, 'patch')
    this.em.persist(newSheetVersion)

    const apiFiles = await Promise.all(dto.files.map(async (file) => {
      const hash = revisionHash(file.raw)

      const apiFile = this.apiFileRepo.create({
        path: file.path,
        sheet,
        hash,
        version: newSheetVersion,
      })

      const filepath = await this.getFilepath(apiFile)
      await this.storageService.writeFile(filepath, file.raw)

      this.em.persist(apiFile)

      return apiFile
    }))

    await this.em.flush()

    for (const apiFile of apiFiles) {
      this.eventEmitter.emit(
        'api-file.created',
        new ApiFileCreatedEvent(apiFile)
      )
    }

    return apiFiles
  }

  async queryApiFiles(dto: QueryApiFilesDTO): Promise<ResponseOfQueryApiFilesDTO> {
    const qb = this.apiFileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.sdks', 'sdks')
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
      f1.version.getEntity().version,
      f2.version.getEntity().version,
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

  private async queryRaw(documentFile: ApiFile): Promise<Readable> {
    const filepath = await this.getFilepath(documentFile)
    const cacheFilepath = path.join(this.cacheService.directory, filepath)

    this.logger.debug(`cacheFilepath: ${cacheFilepath}`)
    const cacheExists = await fs.pathExists(cacheFilepath)
    if (!cacheExists) {
      this.logger.debug('cacheFilepath not exists, uncompressing')
      const buf = await this.storageService.readFile(filepath)
      await fs.ensureDir(path.dirname(cacheFilepath))
      await fs.writeFile(cacheFilepath, buf)
      this.logger.debug('readFile done')
    }

    this.logger.debug('cacheFilepath exists, creating stream')
    const stream = fs.createReadStream(cacheFilepath)
    const intoStream = (await import('into-stream')).default
    return intoStream(stream)
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
    this.eventEmitter.emit(
      'api-file.deleted',
      new ApiFileDeletedEvent(apiFile)
    )

    const filepath = await this.getFilepath(apiFile)
    await this.storageService.removeFile(filepath)
  }
}
