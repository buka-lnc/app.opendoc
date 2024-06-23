import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto"
import type { SheetVersion } from "./sheet_version"


/**
 * @interface QuerySheetVersionsResponseDTO
 * @export
 */
export interface QuerySheetVersionsResponseDTO {
  "results": (SheetVersion)[]
  "pagination": ResponseOfPaginationDTO
}
