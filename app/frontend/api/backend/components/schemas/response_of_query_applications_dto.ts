import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto"
import type { ApplicationDTO } from "./application_dto"


/**
 * @interface ResponseOfQueryApplicationsDTO
 * @export
 */
export interface ResponseOfQueryApplicationsDTO {
  "results": (ApplicationDTO)[]
  "pagination": ResponseOfPaginationDTO
}
