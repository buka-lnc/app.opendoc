import { EntityManager } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import * as R from 'ramda'
import { RegisterFolderDTO } from './dto/register-folder.dto'
import { Folder } from './entities/folder.entity'


@Injectable()
export class FolderService {
  constructor(
    private readonly em: EntityManager,
  ) { }

  private formatMpath(mpath: string): string {
    return mpath.endsWith('/') ? mpath : mpath.concat('/')
  }

  private parseMpath(mpath: string): string[] {
    if (mpath.endsWith('/')) {
      return mpath.slice(0, -1).split('/')
    }

    return mpath.split('/')
  }

  private stringifyMpath(paths: string[]): string {
    return `${paths.join('/')}/`
  }

  async register(dto: RegisterFolderDTO): Promise<void> {
    await this.ensurePath(dto.mpath)

    const folder = await this.em.findOneOrFail(Folder, {
      mpath: this.formatMpath(dto.mpath),
    })

    folder.title = dto.title || folder.code
    this.em.persist(folder)
  }

  async ensurePath(mpath: string): Promise<Folder> {
    const paths = this.parseMpath(mpath)
    if (paths[0] !== 'opendoc') {
      throw new BadRequestException('Invalid mpath')
    }

    const mpathOfAncestors = paths.map((code, index, paths) => this.stringifyMpath(paths.slice(0, index + 1)))

    const ancestors = await this.em.find(Folder, {
      mpath: { $in: mpathOfAncestors },
    })

    const nonExistMpath = R.difference(mpathOfAncestors, R.pluck('mpath', ancestors))

    const nonExistFolders = nonExistMpath
      .map((mpath) => {
        const code = R.last(this.parseMpath(mpath))

        return this.em.create(Folder, {
          mpath,
          code,
          title: code,
        })
      })

    this.em.persist(nonExistFolders)

    return this.queryFolderByMpath(mpath)
  }

  async removeById(folderId: string): Promise<void> {
    const folder = await this.em.findOneOrFail(Folder, folderId)
    await this.removeByMpath(folder.mpath)
  }

  async removeByMpath(mpath: string): Promise<void> {
    const paths = this.parseMpath(mpath)
    if (paths.length < 2) {
      throw new BadRequestException('Invalid mpath')
    }

    const folders = await this.em.find(Folder, {
      mpath: { $like: `${mpath}%` },
    })

    this.em.remove(folders)
  }


  async queryFolders(): Promise<Folder[]> {
    const folders = await this.em.findAll(Folder, {})
    return folders
  }

  async queryFolderById(folderId): Promise<Folder> {
    return this.em.findOneOrFail(Folder, { id: folderId })
  }

  async queryFolderByMpath(mpath: string): Promise<Folder> {
    return this.em.findOneOrFail(Folder, { mpath: this.formatMpath(mpath) })
  }
}
