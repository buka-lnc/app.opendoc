import { ApiDocument } from "./api_document"
import { Sdk } from "./sdk"


/**
 * @interface ApiDocumentFile
 * @export
 */
export interface ApiDocumentFile {
  "apiDocument": ApiDocument
  "sdks"?: (Sdk)[]
  /**
   * 文档文件的指纹
   */
  "hash": string
  /**
   * 文档文件的标签
   */
  "tag"?: string
  /**
   * 文档文件的版本
   */
  "version": string
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
