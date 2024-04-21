import { Injectable } from "@nestjs/common";
import { StorageConfig } from "~/config/storage.config";
import * as fs from 'fs-extra'
import * as path from 'path'
import { StandardStorageService } from "./interface/standard-storage-service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { Readable } from "stream";

@Injectable()
export class DiskService implements StandardStorageService {
  constructor(
    @InjectPinoLogger(DiskService.name)
    private readonly logger: PinoLogger,

    private readonly storageConfig: StorageConfig,
  ){}

  async writeFile(relativePath: string, content: Buffer): Promise<void> {
    const filepath = path.join(this.storageConfig.directory, relativePath)
    const dir = path.dirname(filepath)
    await fs.ensureDir(dir)
    await fs.writeFile(filepath, content)
  }

  async readFile(relativePath: string): Promise<Buffer> {
    const filepath = path.join(this.storageConfig.directory, relativePath)
    return await fs.readFile(filepath)
  }

  async createStream(relativePath: string): Promise<Readable> {
    const filepath = path.join(this.storageConfig.directory, relativePath)
    const intoStream = (await import('into-stream')).default
    const stream = fs.createReadStream(filepath)
    return intoStream(stream)
  }

  async removeFile(relativePath: string): Promise<void> {
    const filepath = path.join(this.storageConfig.directory, relativePath)
    await fs.remove(filepath)
  }
}
