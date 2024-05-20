import { ApplicationDTO } from "./application_dto"
import { ResponseOfPaginationDTO } from "./response_of_pagination_dto"


/**
 * @interface ResponseOfQueryApplicationsDTO
 * @export
 */
export interface ResponseOfQueryApplicationsDTO {
  "results": (ApplicationDTO)[]
  "pagination": ResponseOfPaginationDTO
}
