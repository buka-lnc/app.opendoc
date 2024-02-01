import { Collection } from "./collection"


/**
 * @interface Folder
 * @export
 */
export interface Folder {
  code: string
  mpath: string
  title: string
  documents: Collection
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
