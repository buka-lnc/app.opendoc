import { Sheet } from "./sheet"
import { ResponseOfPaginationDTO } from "./response_of_pagination_dto"


/**
 * @interface ResponseOfQuerySheetsDTO
 * @export
 */
export interface ResponseOfQuerySheetsDTO {
  "results": (Sheet)[]
  "pagination": ResponseOfPaginationDTO
}
