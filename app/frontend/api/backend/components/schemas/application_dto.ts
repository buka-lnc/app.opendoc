/**
 * @interface ApplicationDTO
 * @export
 */
export interface ApplicationDTO {
  "id": string
  /**
   * @type date-time
   */
  "createAt": string
  /**
   * @type date-time
   */
  "updateAt": string
  /**
   * 唯一应用编码
   */
  "code": string
  /**
   * 应用名称
   */
  "title": string
}
