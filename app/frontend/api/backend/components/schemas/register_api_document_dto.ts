/**
 * @interface RegisterApiDocumentDTO
 * @export
 */
export interface RegisterApiDocumentDTO {
  /**
   * 文档文件
   */
  "apiDocumentFile"?: {
    /**
     * @type binary
     */
    "file"?: string
  }
  /**
   * 应用编码
   * 将文档注册到哪个应用下
   */
  "applicationCode": string
  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  "apiDocumentCode": string
  /**
   * 文档类型
   */
  "apiDocumentType": "markdown" | "openapi" | "asyncapi"
  /**
   * 文档名称
   */
  "apiDocumentTitle"?: string
  /**
   * 文档文件的定时同步地址
   */
  "apiDocumentCronSyncUrl"?: string
  /**
   * 文档排序
   */
  "apiDocumentOrder"?: number
  /**
   * 文档标签
   */
  "apiDocumentFileTag"?: string
}
