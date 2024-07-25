import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto"
import type { Sdk } from "./sdk"


/**
 * @interface ResponseOfQuerySdksDTO
 * @export
 */
export interface ResponseOfQuerySdksDTO {
  "results": (Sdk)[]
  "pagination": ResponseOfPaginationDTO
}
