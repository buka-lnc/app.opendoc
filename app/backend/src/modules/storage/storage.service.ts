import { Injectable } from "@nestjs/common";
import { StorageConfig } from "~/config/storage.config";
import { StorageConfigType } from "~/constants/storage-config-type.enum";
import { DiskService } from "./disk.service";
import { StandardStorageService } from "./interface/standard-storage-service";
import { S3Service } from "./s3.service";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { Readable } from "stream";
import { OssService } from "./oss.service";
import { CacheService } from "./cache.service";

@Injectable()
export class StorageService implements StandardStorageService {
  constructor(
    @InjectPinoLogger(DiskService.name)
    private readonly logger: PinoLogger,

    private readonly storageConfig: StorageConfig,
    private readonly cacheService: CacheService,

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

  async readFile(filepath: string): Promise<Buffer> {
    if (await this.cacheService.exists(filepath)) {
      return this.cacheService.readFile(filepath)
    }

    let content: Buffer
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        content = await this.diskService.readFile(filepath);
      case StorageConfigType.S3:
        content = await this.s3Service.readFile(filepath);
      case StorageConfigType.Oss:
        content = await this.ossService.readFile(filepath);
    }

    await this.cacheService.add(filepath, content)
    return content
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

  async removeFile(filepath: string): Promise<void> {
    switch (this.storageConfig.type) {
      case StorageConfigType.Disk:
        await this.diskService.removeFile(filepath);
      case StorageConfigType.S3:
        await this.s3Service.removeFile(filepath);
      case StorageConfigType.Oss:
        await this.ossService.removeFile(filepath);
    }

    await this.cacheService.removeFile(filepath)
  }
}
