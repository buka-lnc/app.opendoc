import { ApplicationIdReferenceDTO } from "./application_id_reference_dto"
import { ApplicationCodeReferenceDTO } from "./application_code_reference_dto"
import { SheetPullCrontabDTO } from "./sheet_pull_crontab_dto"


/**
 * @interface CreateSheetDTO
 * @export
 */
export interface CreateSheetDTO {
  /**
   * 应用编码
   * 将文档创建到哪个应用下
   */
  "application": ApplicationIdReferenceDTO | ApplicationCodeReferenceDTO
  /**
   * 文档拉取定时任务(mode &#x3D; pull)
   */
  "pullCrontab"?: SheetPullCrontabDTO
  /**
   * 文档排序
   */
  "order"?: number
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
  "mode": "pull" | "push"
}
