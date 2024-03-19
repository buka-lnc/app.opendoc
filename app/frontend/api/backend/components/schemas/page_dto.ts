/**
 * @interface PageDTO
 * @export
 */
export interface PageDTO {
  /**
   * 每页的数量
   */
  "limit": number
  /**
   * 当前页的偏移量
   */
  "offset": number
  /**
   * 总数
   */
  "total": number
}
