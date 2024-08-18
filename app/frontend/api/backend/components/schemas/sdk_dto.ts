import type { ParsedVersionDTO } from "./parsed_version_dto"
import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface SdkDTO
 * @export
 */
export interface SdkDTO {
  /**
   * sdk 名
   */
  "name": string
  /**
   * sdk 可用状态
   */
  "status": "pending" | "compiling" | "published" | "failed"
  /**
   * @type date-time
   * 发布时间
   */
  "publishedAt"?: string
  "version": ParsedVersionDTO
  "plugin": EntityReferenceDTO
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
