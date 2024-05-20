import { ApiFile } from "./api_file"
import { ResponseOfPaginationDTO } from "./response_of_pagination_dto"


/**
 * @interface ResponseOfQueryApiFilesDTO
 * @export
 */
export interface ResponseOfQueryApiFilesDTO {
  "results": (ApiFile)[]
  "pagination": ResponseOfPaginationDTO
}
