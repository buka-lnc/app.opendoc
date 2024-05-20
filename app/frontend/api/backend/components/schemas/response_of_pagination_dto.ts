/**
 * @interface ResponseOfPaginationDTO
 * @export
 */
export interface ResponseOfPaginationDTO {
  /**
   * 总数
   */
  "total": number
  /**
   * @default 10
   */
  "limit": number
  /**
   * @default 0
   */
  "offset": number
}
