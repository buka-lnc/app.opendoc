import { Collection } from "./collection"


/**
 * @interface Application
 * @export
 */
export interface Application {
  code: string
  title: string
  apiDocuments: Collection
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
