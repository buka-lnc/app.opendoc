import type { Collection } from "./collection"


/**
 * @interface Compiler
 * @export
 */
export interface Compiler {
  "status": {
  }
  "url": string
  "name": string
  "author": string
  "version": string
  "options": Collection
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
