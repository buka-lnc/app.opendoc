import { ApiDocument } from "./api_document"


/**
 * @interface Application
 * @export
 */
export interface Application {
  "apiDocuments": (ApiDocument)[]
  /**
   * 唯一应用编码
   */
  "code": string
  /**
   * 应用名称
   */
  "title": string
  "id": string
  /**
   * @type date-time
   */
  "createAt": string
  /**
   * @type date-time
   */
  "updateAt": string
}
