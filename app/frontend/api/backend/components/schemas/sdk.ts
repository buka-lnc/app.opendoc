import { ApiDocument } from "./api_document"
import { ApiDocumentFile } from "./api_document_file"
import { SdkTask } from "./sdk_task"


/**
 * @interface Sdk
 * @export
 */
export interface Sdk {
  /**
   * 完整名称
   */
  "fullName": string
  /**
   * 所属文档
   */
  "apiDocument": ApiDocument
  /**
   * 关联的文档文件
   */
  "apiDocumentFile": ApiDocumentFile
  "sdkTask"?: SdkTask
  "scope": string
  /**
   * Npm包名
   */
  "name": string
  /**
   * 版本
   */
  "version": string
  /**
   * 标签
   */
  "tag"?: string
  /**
   * 是否已发布
   */
  "isPublished": boolean
  /**
   * @type date-time
   * 发布时间
   */
  "publishedAt"?: string
  /**
   * Npm 压缩包
   */
  "tarball"?: string
  /**
   * Npm 压缩包的sha512
   */
  "integrity"?: string
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
