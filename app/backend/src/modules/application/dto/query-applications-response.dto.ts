import { PageDTO } from '~/dto/page.dto'
import { Application } from '../entity/application.entity'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'


export class QueryApplicationsResponseDTO {
  @ValidateNested({ each: true })
  @Type(() => Application)
  results: Application[]

  @ValidateNested()
  @Type(() => PageDTO)
  page: PageDTO
}
