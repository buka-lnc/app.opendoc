import { Injectable } from "@nestjs/common";
import { StorageConfig } from "~/config/storage.config";
import { StorageConfigType } from "~/constants/storage-config-type.enum";
import { DiskService } from "./disk.service";
import { StandardStorageService } from "./interface/standard-storage-service";
import { S3Service } from "./s3.service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { Readable } from "stream";
import { OssService } from "./oss.service";

@Injectable()
export class StorageService implements StandardStorageService {
  constructor(
    @InjectPinoLogger(DiskService.name)
    private readonly logger: PinoLogger,

    private readonly storageConfig: StorageConfig,

    private readonly diskService: DiskService,
    private readonly s3Service: S3Service,
    private readonly ossService: OssService,
  ) {}

  writeFile(filepath: string, content: Buffer): Promise<void> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        return this.diskService.writeFile(filepath, content);
      case StorageConfigType.S3:
        return this.s3Service.writeFile(filepath, content);
      case StorageConfigType.Oss:
        return this.ossService.writeFile(filepath, content);
    }
  }

  readFile(filepath: string): Promise<Buffer> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        return this.diskService.readFile(filepath);
      case StorageConfigType.S3:
        return this.s3Service.readFile(filepath);
      case StorageConfigType.Oss:
        return this.ossService.readFile(filepath);
    }
  }

  createStream(filepath: string): Promise<Readable> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        return this.diskService.createStream(filepath);
      case StorageConfigType.S3:
        return this.s3Service.createStream(filepath);
      case StorageConfigType.Oss:
        return this.ossService.createStream(filepath);
    }
  }

  removeFile(filepath: string): Promise<void> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        return this.diskService.removeFile(filepath);
      case StorageConfigType.S3:
        return this.s3Service.removeFile(filepath);
      case StorageConfigType.Oss:
        return this.ossService.removeFile(filepath);
    }
  }
}
