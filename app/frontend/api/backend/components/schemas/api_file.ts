import { SheetVersion } from "./sheet_version"
import { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface ApiFile
 * @export
 */
export interface ApiFile {
  "version": SheetVersion
  "sheet": EntityReferenceDTO
  /**
   * 文件的路径
   */
  "path": string
  /**
   * 文件的指纹
   */
  "hash": string
  /**
   * 主键
   */
  "id": string
  /**
   * @type date-time
   * 创建时间
   */
  "createdAt": string
  /**
   * @type date-time
   * 更新时间
   */
  "updatedAt": string
}
