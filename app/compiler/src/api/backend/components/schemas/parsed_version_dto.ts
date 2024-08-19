/**
 * @interface ParsedVersionDTO
 * @export
 */
export interface ParsedVersionDTO {
  /**
   * Major/主版本号
   */
  "major": number
  /**
   * Minor/次版本号
   */
  "minor": number
  /**
   * Patch/修订号
   */
  "patch": number
  /**
   * Pre-release/预发布号
   */
  "prerelease": number
  /**
   * 标签
   */
  "tag": string
}
