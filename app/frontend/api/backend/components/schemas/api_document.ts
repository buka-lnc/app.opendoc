/**
 * @interface ApiDocument
 * @export
 */
export interface ApiDocument {
  type: "markdown" | "openapi" | "asyncapi"
  code: string
  order: number
  title: string
  application: {
  }
  hash: string
  version: string
  cronSyncUrl?: string
  id: string
  /**
   * @type date-time
   */
  createAt: string
  /**
   * @type date-time
   */
  updateAt: string
}
