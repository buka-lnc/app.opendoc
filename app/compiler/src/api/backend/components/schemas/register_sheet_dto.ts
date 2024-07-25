/**
 * @interface RegisterSheetDTO
 * @export
 */
export interface RegisterSheetDTO {
  /**
   * tgz 压缩文件
   */
  "apiFileRaw"?: {
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
  "sheetCode": string
  /**
   * 文档类型
   */
  "sheetType": "markdown" | "openapi" | "asyncapi"
  /**
   * 文档名称
   */
  "sheetTitle"?: string
  /**
   * 文档排序
   */
  "sheetOrder"?: number
  /**
   * 文档同步模式
   * 
   * @default ApiDocumentMode.PUSH
   */
  "sheetMode"?: "pull" | "push"
  "sheetPullCrontabUrl"?: string
  /**
   * 文档标签
   */
  "apiFileVersionTag"?: string
}
