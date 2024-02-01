import { EntityManager } from '@mikro-orm/core'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { RegisterFolderDTO } from './dto/register-folder.dto'
import { Folder } from './entities/folder.entity'
import { FolderService } from './folder.service'

@Controller('folder')
export class FolderController {
  constructor(
    private readonly em: EntityManager,
    private readonly folderService: FolderService,
  ) { }

  @Post()
  async registerFolder(
    @Body() dto: RegisterFolderDTO,
  ): Promise<void> {
    await this.folderService.register(dto)
    await this.em.flush()
  }

  @Get()
  async queryFolders(): Promise<Folder[]> {
    const results = await this.folderService.queryFolders()
    return results
  }
}
