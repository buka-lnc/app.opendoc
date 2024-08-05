import type { EntityReferenceDTO } from "./entity_reference_dto"
import type { SheetVersion } from "./sheet_version"


/**
 * @interface Sdk
 * @export
 */
export interface Sdk {
  /**
   * sdk 名
   */
  "name": string
  /**
   * sdk 可用状态
   */
  "status": "initializing" | "pending" | "compiling" | "published" | "error"
  /**
   * @type date-time
   * 发布时间
   */
  "publishedAt"?: string
  "compiler": EntityReferenceDTO
  /**
   * 版本号
   */
  "version": SheetVersion
  /**
   * 所属文档
   */
  "sheet": EntityReferenceDTO
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
