import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface PluginOption
 * @export
 */
export interface PluginOption {
  /**
   * 选项键
   */
  "key": string
  /**
   * 选项排序
   */
  "order": number
  /**
   * 选项名
   */
  "label": string
  /**
   * 选项描述
   */
  "description": string
  /**
   * 选项格式
   */
  "format": "string" | "number" | "boolean"
  /**
   * 选项值
   */
  "value"?: string
  "plugin": EntityReferenceDTO
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
