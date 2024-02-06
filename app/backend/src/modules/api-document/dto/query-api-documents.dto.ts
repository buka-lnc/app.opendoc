import { PartialType } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { PaginationDTO } from '~/dto/pagination.dto'

export class QueryApiDocumentsDTO extends PartialType(PaginationDTO) {
  @IsString()
  title?: string

  @IsString()
  type?: string
}
