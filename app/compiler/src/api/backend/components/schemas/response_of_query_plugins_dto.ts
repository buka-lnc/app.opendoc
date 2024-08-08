import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto"
import type { Plugin } from "./plugin"


/**
 * @interface ResponseOfQueryPluginsDTO
 * @export
 */
export interface ResponseOfQueryPluginsDTO {
  "results": (Plugin)[]
  "pagination": ResponseOfPaginationDTO
}
