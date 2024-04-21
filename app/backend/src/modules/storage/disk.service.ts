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

  async writeFile(filepath: string, content: Buffer): Promise<void> {
    const dir = path.dirname(filepath)
    await fs.ensureDir(dir)
    await fs.writeFile(filepath, content)
  }

  async readFile(filepath: string): Promise<Buffer> {
    return await fs.readFile(filepath)
  }

  async createStream(filepath: string): Promise<Readable> {
    const intoStream = (await import('into-stream')).default
    const stream = fs.createReadStream(filepath)
    return intoStream(stream)
  }

  async removeFile(filepath: string): Promise<void> {
    await fs.remove(filepath)
  }
}
