import { PageDTO } from '~/dto/page.dto'
import { ApiDocument } from '../entities/api-document.entity'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryApiDocumentsResponseDTO {
  @ValidateNested()
  @Type(() => ApiDocument)
  results: ApiDocument[]

  @ValidateNested()
  @Type(() => PageDTO)
  page: PageDTO
}
