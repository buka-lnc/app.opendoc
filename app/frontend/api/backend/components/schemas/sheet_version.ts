import { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface SheetVersion
 * @export
 */
export interface SheetVersion {
  "sheet": EntityReferenceDTO
  "version": string
  /**
   * 标签
   */
  "tag"?: string
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
