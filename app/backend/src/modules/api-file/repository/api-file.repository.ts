import { CreateOptions, EntityRepository, RequiredEntityData } from '@mikro-orm/mysql'
import { ApiFile } from '../entities/api-file.entity'
import { ForeignFile } from '../dto/foreign-file.dto'
import revisionHash from 'rev-hash'


export class ApiFileRepository extends EntityRepository<ApiFile> {
  create<Convert extends boolean = false>(
    data: Omit<RequiredEntityData<ApiFile, never, Convert>, 'hash'> & { raw: Buffer },
    options?: CreateOptions<Convert> | undefined
  ): ApiFile {
    const entity = super.create({ ...data, hash: '' }, options)
    entity.raw = data.raw
    return entity
  }

  /**
   * 对比 apiFiles 的文件内容 与 files 是否有差异
   */
  hasDifference(apiFiles: ApiFile[], foreignFiles: ForeignFile[]): boolean {
    if (apiFiles.length !== foreignFiles.length) return true

    for (const foreignFile of foreignFiles) {
      const apiFile = apiFiles.find((f) => f.path === foreignFile.path)
      // 新版文件在当前版本中不存在
      if (!apiFile) return true
      // 文件hash不一致
      if (apiFile.hash !== revisionHash(foreignFile.raw)) return true
    }

    // 当前版本的文件在新版本中不存在
    if (apiFiles.some((f) => !foreignFiles.find((file) => file.path === f.path))) return true

    return false
  }
}
