/**
 * @interface UpdateSdkDTO
 * @export
 */
export interface UpdateSdkDTO {
  /**
   * sdk 可用状态
   */
  "status"?: "pending" | "compiling" | "published" | "error"
  /**
   * 主键
   */
  "id": string
}
