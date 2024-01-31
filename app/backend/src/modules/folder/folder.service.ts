import { EntityManager } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import * as R from 'ramda'
import { RegisterFolderDto } from './dto/register-folder.dto'
import { Folder } from './entities/folder.entity'


@Injectable()
export class FolderService {
  constructor(
    private readonly em: EntityManager,
  ) { }

  async register(dto: RegisterFolderDto): Promise<void> {
    await this.ensurePath(dto.mpath)

    const folder = await this.em.findOneOrFail(Folder, {
      mpath: dto.mpath,
    })

    folder.title = dto.title
  }

  async ensurePath(mpath: string): Promise<void> {
    const mpathOfAncestors = mpath
      .split('/')
      .map((code, index, paths) => paths.slice(0, index + 1).join('/'))

    const ancestors = await this.em.find(Folder, { mpath: { $in: mpathOfAncestors } })

    const nonExistFolder = R.uniq([...mpathOfAncestors, ...ancestors.map((folder) => folder.mpath)])
      .map((mpath) => {
        const code = mpath.split('/').pop()

        return this.em.create(Folder, {
          mpath,
          code,
          title: code,
        })
      })

    this.em.persist(nonExistFolder)
  }

}
