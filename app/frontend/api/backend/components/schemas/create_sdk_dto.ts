import type { EntityReferenceDTO } from "./entity_reference_dto"
import type { ParsedVersionDTO } from "./parsed_version_dto"


/**
 * @interface CreateSdkDTO
 * @export
 */
export interface CreateSdkDTO {
  /**
   * sdk 名
   */
  "name": string
  "sheet": EntityReferenceDTO
  "version": ParsedVersionDTO
  "compiler": EntityReferenceDTO
}
