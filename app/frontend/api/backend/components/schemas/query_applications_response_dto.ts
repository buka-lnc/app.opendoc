import { ApplicationDTO } from "./application_dto"
import { PageDTO } from "./page_dto"


/**
 * @interface QueryApplicationsResponseDTO
 * @export
 */
export interface QueryApplicationsResponseDTO {
  results: (ApplicationDTO)[]
  page: PageDTO
}
