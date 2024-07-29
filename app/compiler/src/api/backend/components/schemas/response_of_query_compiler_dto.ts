import type { ResponseOfPaginationDTO } from "./response_of_pagination_dto"
import type { Compiler } from "./compiler"


/**
 * @interface ResponseOfQueryCompilerDTO
 * @export
 */
export interface ResponseOfQueryCompilerDTO {
  "results": (Compiler)[]
  "pagination": ResponseOfPaginationDTO
}
