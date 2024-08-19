import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface SheetVersion
 * @export
 */
export interface SheetVersion {
  /**
   * Major/主版本号
   */
  "major": number
  /**
   * Minor/次版本号
   */
  "minor": number
  /**
   * Patch/修订号
   */
  "patch": number
  /**
   * Pre-release/预发布号
   */
  "prerelease": number
  /**
   * 标签
   */
  "tag": string
  "sheet": EntityReferenceDTO
  /**
   * 版本号
   */
  "string": string
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
