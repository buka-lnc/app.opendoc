/**
 * @interface ApplicationDTO
 * @export
 */
export interface ApplicationDTO {
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
   * 唯一应用编码
   */
  "code": string
  /**
   * 应用名称
   */
  "title": string
}
