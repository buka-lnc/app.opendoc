import { ApiDocument } from "./api_document"
import { PageDTO } from "./page_dto"


/**
 * @interface QueryApiDocumentsResponseDTO
 * @export
 */
export interface QueryApiDocumentsResponseDTO {
  results: (ApiDocument)[]
  page: PageDTO
}
