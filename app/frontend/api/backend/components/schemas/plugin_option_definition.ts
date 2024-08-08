/**
 * @interface PluginOptionDefinition
 * @export
 */
export interface PluginOptionDefinition {
  /**
   * 选项名
   */
  "label"?: string
  /**
   * 选项描述
   */
  "description"?: string
  /**
   * 选项键
   */
  "key": string
  /**
   * 选项格式
   */
  "format": "string" | "number" | "boolean"
  /**
   * 选项值
   */
  "value"?: string
}
