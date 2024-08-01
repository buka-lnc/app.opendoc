import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface CompilerOption
 * @export
 */
export interface CompilerOption {
  "compiler": EntityReferenceDTO
  "key": string
  "label": string
  "description": string
  "format": "string" | "number" | "boolean"
  "value"?: string
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
