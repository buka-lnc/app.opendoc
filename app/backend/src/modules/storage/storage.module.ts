import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { DiskService } from './disk.service'
import { S3Service } from './s3.service'
import { OssService } from './oss.service'
import { CacheService } from './cache.service'


@Module({
  imports: [],
  controllers: [],
  providers: [
    CacheService,
    StorageService,
    DiskService,
    S3Service,
    OssService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
