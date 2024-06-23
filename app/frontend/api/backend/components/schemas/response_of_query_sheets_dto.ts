import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto"
import type { Sheet } from "./sheet"


/**
 * @interface ResponseOfQuerySheetsDTO
 * @export
 */
export interface ResponseOfQuerySheetsDTO {
  "results": (Sheet)[]
  "pagination": ResponseOfPaginationDTO
}
