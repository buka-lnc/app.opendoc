/**
 * @interface UpdateSdkDTO
 * @export
 */
export interface UpdateSdkDTO {
  /**
   * sdk 可用状态
   */
  "status"?: "pending" | "compiling" | "published" | "failed"
  /**
   * 主键
   */
  "id": string
}
