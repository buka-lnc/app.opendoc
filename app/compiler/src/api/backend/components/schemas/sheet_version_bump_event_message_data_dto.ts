import type { ApplicationDTO } from "./application_dto"
import type { SheetDTO } from "./sheet_dto"
import type { ParsedVersionDTO } from "./parsed_version_dto"
import type { Compiler } from "./compiler"


/**
 * @interface SheetVersionBumpEventMessageDataDTO
 * @export
 */
export interface SheetVersionBumpEventMessageDataDTO {
  "application": ApplicationDTO
  "sheet": SheetDTO
  "version": ParsedVersionDTO
  "compiler": Compiler
}
