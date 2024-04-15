import { IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from '~/dto/pagination.dto'


export class QueryApplicationsDTO extends PaginationDTO {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  code?: string
}
