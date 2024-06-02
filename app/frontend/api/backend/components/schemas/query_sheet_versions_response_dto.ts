import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto.js"
import type { SheetVersion } from "./sheet_version.js"


/**
 * @interface QuerySheetVersionsResponseDTO
 * @export
 */
export interface QuerySheetVersionsResponseDTO {
  "results": (SheetVersion)[]
  "pagination": ResponseOfPaginationDTO
}
