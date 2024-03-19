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
  "createdAt": string
  /**
   * @type date-time
   */
  "updatedAt": string
}
