import { EntityRepository, FilterQuery } from '@mikro-orm/mysql'
import { Sheet } from '../entities/sheet.entity'
import { SheetVersion } from '../../sheet-version/entities/sheet-version.entity'
import { ForeignFile } from '~/modules/api-file/dto/foreign-file.dto'
import { ApiFile } from '~/modules/api-file/entities/api-file.entity'
import { RegisterSheet } from '../types/register-sheet'


export class SheetRepository extends EntityRepository<Sheet> {
  async findMaxVersion(where: FilterQuery<Sheet>, tag?: string): Promise<SheetVersion | null> {
    const qb = this.em.createQueryBuilder(SheetVersion, 'version')
      .orderBy([
        { major: 'desc' },
        { minor: 'desc' },
        { patch: 'desc' },
        { prerelease: 'desc' },
      ])
      .andWhere({ sheet: where })

    if (tag && tag.length) {
      void qb.andWhere({ tag: [tag, ''] })
    } else {
      void qb.andWhere({ tag: '' })
    }

    const version = await qb.getSingleResult()
    return version
  }


  /**
   * 对比 sheet 最新版本的文件 和 files 是否有差异
   */
  async needBump(sheet: Sheet, files: ForeignFile[]): Promise<boolean> {
    const maxSheetVersion = await this.findMaxVersion(sheet)
    if (!maxSheetVersion) return true

    const apiFileRepo = this.em.getRepository(ApiFile)
    const apiFiles = await maxSheetVersion.apiFiles.loadItems()
    return apiFileRepo.hasDifference(apiFiles, files)
  }

  async register(dto: RegisterSheet): Promise<Sheet> {
    let sheet = await this.em.findOneOrFail(Sheet, { code: dto.code })

    if (!sheet) {
      sheet = this.create({
        application: dto.application,
        type: dto.type,
        code: dto.code,
        title: dto.title || dto.code,
        mode: dto.mode,
        order: dto.order,
        pullCrontab: dto.pullCrontab,
      })
    } else {
      if (dto.title) sheet.title = dto.title
      if (dto.order) sheet.order = dto.order
    }

    return sheet
  }

  async bumpVersion(sheet: Sheet, files: ForeignFile[], releaseType: 'major' | 'minor' | 'patch', tag?: string): Promise<SheetVersion> {
    const sheetVersionRepo = this.em.getRepository(SheetVersion)
    const apiFileRepo = this.em.getRepository(ApiFile)

    const maxSheetVersion = await this.findMaxVersion(sheet)
    const version = maxSheetVersion ? await sheetVersionRepo.increase(maxSheetVersion, releaseType, tag) : sheetVersionRepo.createInitialVersion(sheet, tag)

    for (const file of files) {
      apiFileRepo.create({
        path: file.path,
        sheet: sheet,
        version,
        raw: file.raw,
      })
    }

    return version
  }
}
