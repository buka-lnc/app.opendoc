import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto.js"
import type { Sdk } from "./sdk.js"


/**
 * @interface ResponseOfQuerySdksDTO
 * @export
 */
export interface ResponseOfQuerySdksDTO {
  "results": (Sdk)[]
  "pagination": ResponseOfPaginationDTO
}
