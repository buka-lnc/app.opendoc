import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto"
import type { ApiFile } from "./api_file"


/**
 * @interface ResponseOfQueryApiFilesDTO
 * @export
 */
export interface ResponseOfQueryApiFilesDTO {
  "results": (ApiFile)[]
  "pagination": ResponseOfPaginationDTO
}
