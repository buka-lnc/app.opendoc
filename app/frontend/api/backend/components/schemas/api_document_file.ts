/**
 * @interface ApiDocumentFile
 * @export
 */
export interface ApiDocumentFile {
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
  "apiDocument": {
  }
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
