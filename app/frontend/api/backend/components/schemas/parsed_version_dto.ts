/**
 * @interface ParsedVersionDTO
 * @export
 */
export interface ParsedVersionDTO {
  "major": number
  "minor": number
  "patch": number
  /**
   * 标签
   */
  "tag": string
  "prerelease": number
}
