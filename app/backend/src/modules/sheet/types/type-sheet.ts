import { ForeignFile } from '~/modules/api-file/dto/foreign-file.dto'

export interface TypeSheet {
  /**
   * 对比两个版本的文件差异
   * @param lastFiles 上一个版本的文件
   * @param nextFiles 下一个版本的文件
   * @returns 文件版本差异
   */
  bumpSheetVersion(lastFiles: ForeignFile[], nextFiles: ForeignFile[]): Promise<'major' | 'minor' | 'patch'> | 'major' | 'minor' | 'patch'
}
