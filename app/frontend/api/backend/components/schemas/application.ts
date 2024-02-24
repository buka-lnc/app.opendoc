import { ApiDocument } from "./api_document"


/**
 * @interface Application
 * @export
 */
export interface Application {
  apiDocuments: (ApiDocument)[]
  code: string
  title: string
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
