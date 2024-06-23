import type { SheetPullCrontab } from "./sheet_pull_crontab"
import type { EntityReferenceDTO } from "./entity_reference_dto"


/**
 * @interface Sheet
 * @export
 */
export interface Sheet {
  /**
   * 文档文件的定时同步地址
   */
  "pullCrontab"?: SheetPullCrontab
  /**
   * 文档所属的应用
   */
  "application": EntityReferenceDTO
  /**
   * 文档名称
   */
  "title": string
  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  "code": string
  /**
   * 文档排序
   */
  "order": number
  /**
   * 文档类型
   */
  "type": "markdown" | "openapi" | "asyncapi"
  "mode": "pull" | "push"
  /**
   * 主键
   */
  "id": string
  /**
   * @type date-time
   * 创建时间
   */
  "createdAt": string
  /**
   * @type date-time
   * 更新时间
   */
  "updatedAt": string
}
