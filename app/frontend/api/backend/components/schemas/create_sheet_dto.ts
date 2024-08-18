import type { ApplicationIdReferenceDTO } from "./application_id_reference_dto"
import type { ApplicationCodeReferenceDTO } from "./application_code_reference_dto"
import type { SheetPullCrontabDTO } from "./sheet_pull_crontab_dto"


/**
 * @interface CreateSheetDTO
 * @export
 */
export interface CreateSheetDTO {
  "mode": "pull" | "push"
  /**
   * 应用编码
   * 将文档创建到哪个应用下
   */
  "application": ApplicationIdReferenceDTO | ApplicationCodeReferenceDTO
  /**
   * 文档排序
   */
  "order"?: number
  /**
   * 文档拉取定时任务(mode &#x3D; pull)
   */
  "pullCrontab"?: SheetPullCrontabDTO
  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  "code": string
  /**
   * 文档类型
   */
  "type": "markdown" | "openapi" | "asyncapi"
  /**
   * 文档名称
   */
  "title": string
}
