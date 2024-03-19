import { Sdk } from "./sdk"


/**
 * @interface SdkTask
 * @export
 */
export interface SdkTask {
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
