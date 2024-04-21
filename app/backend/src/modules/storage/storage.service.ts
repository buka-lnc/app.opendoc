import { Injectable } from "@nestjs/common";
import { StorageConfig } from "~/config/storage.config";
import { StorageConfigType } from "~/constants/storage-config-type.enum";
import { DiskService } from "./disk.service";
import { StandardStorageService } from "./interface/standard-storage-service";
import { S3Service } from "./s3.service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { Readable } from "stream";

@Injectable()
export class StorageService implements StandardStorageService {
  constructor(
    @InjectPinoLogger(DiskService.name)
    private readonly logger: PinoLogger,

    private readonly storageConfig: StorageConfig,

    private readonly diskService: DiskService,
    private readonly s3Service: S3Service
  ) {}

  writeFile(filepath: string, content: Buffer): Promise<void> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        return this.diskService.writeFile(filepath, content);
      case StorageConfigType.S3:
        return this.s3Service.writeFile(filepath, content);
    }
  }

  readFile(filepath: string): Promise<Buffer> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        return this.diskService.readFile(filepath);
      case StorageConfigType.S3:
        return this.s3Service.readFile(filepath);
    }
  }

  createStream(filepath: string): Promise<Readable> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        return this.diskService.createStream(filepath);
      case StorageConfigType.S3:
        return this.s3Service.createStream(filepath);
    }
  }

  removeFile(filepath: string): Promise<void> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        return this.diskService.removeFile(filepath);
      case StorageConfigType.S3:
        return this.s3Service.removeFile(filepath);
    }
  }
}
