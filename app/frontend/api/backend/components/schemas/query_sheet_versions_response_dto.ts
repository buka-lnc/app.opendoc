import { SheetVersion } from "./sheet_version"
import { ResponseOfPaginationDTO } from "./response_of_pagination_dto"


/**
 * @interface QuerySheetVersionsResponseDTO
 * @export
 */
export interface QuerySheetVersionsResponseDTO {
  "results": (SheetVersion)[]
  "pagination": ResponseOfPaginationDTO
}
