import { ApiDocument } from "./api_document"
import { ApiDocumentFile } from "./api_document_file"
import { SdkPublishLock } from "./sdk_publish_lock"


/**
 * @interface Sdk
 * @export
 */
export interface Sdk {
  /**
   * Npm完整包名
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
  "sdkPublishLock"?: SdkPublishLock
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
   * sdk 可用状态
   */
  "status": "pending" | "compiling" | "published"
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
