import { PageDTO } from '~/dto/page.dto'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApplicationDTO } from './application.dto'


export class QueryApplicationsResponseDTO {
  @ValidateNested({ each: true })
  @Type(() => ApplicationDTO)
  results: ApplicationDTO[]

  @ValidateNested()
  @Type(() => PageDTO)
  page: PageDTO
}
