import { Sdk } from "./sdk"
import { ResponseOfPaginationDTO } from "./response_of_pagination_dto"


/**
 * @interface ResponseOfQuerySdksDTO
 * @export
 */
export interface ResponseOfQuerySdksDTO {
  "results": (Sdk)[]
  "pagination": ResponseOfPaginationDTO
}
