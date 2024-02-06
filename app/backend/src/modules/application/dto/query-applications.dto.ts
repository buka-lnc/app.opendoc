import { IsString } from 'class-validator'
import { PaginationDTO } from '~/dto/pagination.dto'


export class QueryApplicationsDTO extends PaginationDTO {
  @IsString()
  title?: string
}
