import { Collection } from "./collection"


/**
 * @interface ApiDocument
 * @export
 */
export interface ApiDocument {
  /**
   * 文档类型
   */
  "type": "markdown" | "openapi" | "asyncapi"
  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  "code": string
  /**
   * 文档排序
   */
  "order": number
  /**
   * 文档名称
   */
  "title": string
  /**
   * 文档文件的定时同步地址
   */
  "cronSyncUrl"?: string
  /**
   * 文档所属的应用
   */
  "application": {
  }
  "apiDocumentFiles": Collection
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
