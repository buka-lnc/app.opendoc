import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto.js"
import type { Sheet } from "./sheet.js"


/**
 * @interface ResponseOfQuerySheetsDTO
 * @export
 */
export interface ResponseOfQuerySheetsDTO {
  "results": (Sheet)[]
  "pagination": ResponseOfPaginationDTO
}
