import { SheetVersionRepository } from './../sheet-version/repository/sheet-version.repository'
import * as path from 'path'
import { EntityManager, wrap } from '@mikro-orm/core'
import { MikroORM } from '@mikro-orm/mysql'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ApiFile } from './entities/api-file.entity'
import { StorageService } from '../storage/storage.service'
import { Readable } from 'stream'


/**
 * 管理 ApiFile 的文件内容写入和读取
 * 配合 MikroOrm 的 EntitySubscriber 在 ApiFile 创建/更新/删除后，再调用 StorageService 持久化文件
 * 确保对 ApiFile 的文件内容的更改，在未保存到数据库前不会被持久化
 */
@Injectable()
export class ApiFileStorageService {
  constructor(
    @InjectPinoLogger(ApiFileStorageService.name)
    private readonly logger: PinoLogger,


    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly storageService: StorageService,

    private readonly sheetVersionRepo: SheetVersionRepository,
  ) {}

  async getFilepath(apiFile: ApiFile): Promise<string> {
    const sheetVersion = await apiFile.version.loadOrFail()
    const filepath = path.join('api-file', apiFile.sheet.id, sheetVersion.string, apiFile.path)
    return filepath
  }

  async readFile(apiFile: ApiFile): Promise<Buffer | null> {
    if (apiFile.raw === null) {
      if (!wrap(apiFile).isInitialized()) {
        throw new Error('Cannot read ApiFile that is not initialized')
      }

      if (!apiFile.id) {
        return null
      }

      const filepath = await this.getFilepath(apiFile)
      apiFile.raw = await this.storageService.readFile(filepath)
    }

    return apiFile.raw
  }

  async createStream(apiFile: ApiFile): Promise<Readable> {
    const filepath = await this.getFilepath(apiFile)
    return this.storageService.createStream(filepath)
  }

  writeFile(apiFile: ApiFile, raw: Buffer): void {
    apiFile.raw = raw
  }

  async flush(apiFile: ApiFile): Promise<void> {
    if (apiFile.raw === null) return

    const filepath = await this.getFilepath(apiFile)
    await this.storageService.writeFile(filepath, apiFile.raw)
  }

  async removeFile(apiFile: ApiFile): Promise<void> {
    const filepath = await this.getFilepath(apiFile)
    await this.storageService.removeFile(filepath)
  }
}
