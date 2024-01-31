import { EntityManager } from '@mikro-orm/core'
import { Body, Controller, Post } from '@nestjs/common'
import { RegisterFolderDto } from './dto/register-folder.dto'
import { FolderService } from './folder.service'

@Controller('folder')
export class FolderController {
  constructor(
    private readonly em: EntityManager,
    private readonly folderService: FolderService,
  ) { }

  @Post()
  async registerFolder(
    @Body() dto: RegisterFolderDto,
  ) {
    await this.folderService.register(dto)
    await this.em.flush()
  }
}
