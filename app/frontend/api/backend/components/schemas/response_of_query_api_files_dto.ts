import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto.js"
import type { ApiFile } from "./api_file.js"


/**
 * @interface ResponseOfQueryApiFilesDTO
 * @export
 */
export interface ResponseOfQueryApiFilesDTO {
  "results": (ApiFile)[]
  "pagination": ResponseOfPaginationDTO
}
