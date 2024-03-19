import { Application } from "./application"
import { ApiDocumentFile } from "./api_document_file"
import { Sdk } from "./sdk"


/**
 * @interface ApiDocument
 * @export
 */
export interface ApiDocument {
  /**
   * 文档所属的应用
   */
  "application": Application
  "apiDocumentFiles": (ApiDocumentFile)[]
  "sdks": (Sdk)[]
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
