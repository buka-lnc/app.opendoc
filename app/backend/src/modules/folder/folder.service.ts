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

  async queryFolders(): Promise<Folder[]> {
    const folders = await this.em.findAll(Folder, {})
    return folders
  }

  async register(dto: RegisterFolderDTO): Promise<void> {
    await this.ensurePath(dto.mpath)

    const folder = await this.em.findOneOrFail(Folder, {
      mpath: this.formatMpath(dto.mpath),
    })

    folder.title = dto.title
  }

  private formatMpath(mpath: string): string {
    return mpath.endsWith('/') ? mpath : `${mpath}/`
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

  async ensurePath(mpath: string): Promise<Folder> {
    const paths = this.parseMpath(mpath)
    if (paths[0] !== 'opendoc') {
      throw new BadRequestException('Invalid mpath')
    }

    const mpathOfAncestors = paths.map((code, index, paths) => this.stringifyMpath(paths.slice(0, index + 1)))

    const ancestors = await this.em.find(Folder, {
      mpath: { $in: mpathOfAncestors }
    })

    const nonExistFolders = R.uniq([...mpathOfAncestors, ...ancestors.map((folder) => folder.mpath)])
      .map((mpath) => {
        const code = R.last(this.parseMpath(mpath))

        return this.em.create(Folder, {
          mpath,
          code,
          title: code,
        })
      })

    this.em.persist(nonExistFolders)

    return R.last(nonExistFolders)
  }
}
