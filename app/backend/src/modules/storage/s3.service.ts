import { Injectable, InternalServerErrorException } from "@nestjs/common";
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
    throw new InternalServerErrorException('S3 not implemented')
  }

  async readFile(filepath: string): Promise<Buffer> {
    throw new InternalServerErrorException('S3 not implemented')
  }

  async createStream(filepath: string): Promise<Readable> {
    // const intoStream = (await import('into-stream')).default
    // return intoStream('')
    throw new InternalServerErrorException('S3 not implemented')
  }

  async removeFile(filepath: string): Promise<void> {
    throw new InternalServerErrorException('S3 not implemented')
  }
}
