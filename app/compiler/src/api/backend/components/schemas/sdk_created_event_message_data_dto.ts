import type { SdkDTO } from "./sdk_dto"
import type { Compiler } from "./compiler"


/**
 * @interface SdkCreatedEventMessageDataDTO
 * @export
 */
export interface SdkCreatedEventMessageDataDTO {
  "sdk": SdkDTO
  "compiler": Compiler
}
