import type { PluginOption } from "./plugin_option"
import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface Plugin
 * @export
 */
export interface Plugin {
  /**
   * 编译器状态
   */
  "status": "disabled" | "enabled" | "breakdown"
  /**
   * 编译器地址
   */
  "url": string
  /**
   * 编译器名称
   */
  "name": string
  /**
   * 编译器描述
   */
  "description": {
  }
  /**
   * 编译器名称
   */
  "author": {
  }
  /**
   * 编译器版本
   */
  "version": string
  /**
   * 编译器选项
   */
  "options": (PluginOption)[]
  "sdks": (EntityReferenceDTO)[]
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
