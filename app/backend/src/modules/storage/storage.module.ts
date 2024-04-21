import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { DiskService } from './disk.service'
import { S3Service } from './s3.service'


@Module({
  imports: [],
  controllers: [],
  providers: [StorageService, DiskService, S3Service],
  exports: [StorageService],
})
export class StorageModule {}
