/**
 * @interface SheetDTO
 * @export
 */
export interface SheetDTO {
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
  /**
   * 文档名称
   */
  "title": string
  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  "code": string
  /**
   * 文档排序
   */
  "order": number
  /**
   * 文档类型
   */
  "type": "markdown" | "openapi" | "asyncapi"
  "mode": "pull" | "push"
}
