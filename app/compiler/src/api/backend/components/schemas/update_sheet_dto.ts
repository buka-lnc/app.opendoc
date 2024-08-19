import type { SheetPullCrontabDTO } from "./sheet_pull_crontab_dto"


/**
 * @interface UpdateSheetDTO
 * @export
 */
export interface UpdateSheetDTO {
  "mode"?: "pull" | "push"
  "order"?: number
  /**
   * 文档类型
   */
  "type"?: "markdown" | "openapi" | "asyncapi"
  /**
   * 文档名称
   */
  "title"?: string
  /**
   * 文档拉取定时任务(mode &#x3D; pull)
   */
  "pullCrontab"?: SheetPullCrontabDTO
}
