import { Application } from "./application"
import { PageDTO } from "./page_dto"


/**
 * @interface QueryApplicationsResponseDTO
 * @export
 */
export interface QueryApplicationsResponseDTO {
  results: (Application)[]
  page: PageDTO
}
