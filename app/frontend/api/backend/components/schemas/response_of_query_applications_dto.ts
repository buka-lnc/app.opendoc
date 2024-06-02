import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto.js"
import type { ApplicationDTO } from "./application_dto.js"


/**
 * @interface ResponseOfQueryApplicationsDTO
 * @export
 */
export interface ResponseOfQueryApplicationsDTO {
  "results": (ApplicationDTO)[]
  "pagination": ResponseOfPaginationDTO
}
