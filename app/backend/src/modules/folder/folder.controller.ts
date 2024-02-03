import { EntityManager } from '@mikro-orm/core'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { isNumberString } from 'class-validator'
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

  @Get(':folderIdOrMpath*')
  async queryFolder(
    @Param('folderIdOrMpath') folderIdOrMpath: string,
  ): Promise<Folder> {
    if (isNumberString(folderIdOrMpath)) {
      return this.folderService.queryFolderById(folderIdOrMpath)
    }

    return this.folderService.queryFolderByMpath(folderIdOrMpath)
  }

  @Delete(':folderIdOrMpath*')
  async removeFolder(
    @Param('folderIdOrMpath') folderIdOrMpath: string,
  ): Promise<void> {
    if (isNumberString(folderIdOrMpath)) {
      await this.folderService.removeById(folderIdOrMpath)
    } else {
      await this.folderService.removeByMpath(folderIdOrMpath)
    }

    await this.em.flush()
  }
}
