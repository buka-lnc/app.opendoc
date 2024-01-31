import { Module } from '@nestjs/common'
import { FolderController } from './folder.controller'
import { FolderService } from './folder.service'

@Module({
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
