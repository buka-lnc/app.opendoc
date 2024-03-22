import { Sdk } from "./sdk"


/**
 * @interface SdkPublishLock
 * @export
 */
export interface SdkPublishLock {
  "sdk": Sdk
  "id": string
  /**
   * @type date-time
   */
  "createdAt": string
  /**
   * @type date-time
   */
  "updatedAt": string
}
