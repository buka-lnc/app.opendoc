import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface SheetVersion
 * @export
 */
export interface SheetVersion {
  "version": string
  "sheet": EntityReferenceDTO
  "major": number
  "minor": number
  "patch": number
  "prerelease": number
  /**
   * 标签
   */
  "tag": string
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
