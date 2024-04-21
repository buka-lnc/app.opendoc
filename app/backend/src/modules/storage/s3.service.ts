import { Injectable } from "@nestjs/common";
import { StorageConfig } from "~/config/storage.config";
import { StandardStorageService } from "./interface/standard-storage-service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { DiskService } from "./disk.service";
import { Readable } from "stream";

@Injectable()
export class S3Service implements StandardStorageService {
  constructor(
    @InjectPinoLogger(DiskService.name)
    private readonly logger: PinoLogger,

    private readonly storageConfig: StorageConfig,
  ){}

  async writeFile(filepath: string, content: Buffer): Promise<void> {

  }

  async readFile(filepath: string): Promise<Buffer> {
    return Buffer.from('')
  }

  async createStream(filepath: string): Promise<Readable> {
    const intoStream = (await import('into-stream')).default
    return intoStream('')
  }

  async removeFile(filepath: string): Promise<void> {

  }
}
