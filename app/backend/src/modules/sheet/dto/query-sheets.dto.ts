import { PartialType } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from '~/dto/pagination.dto'

export class QuerySheetsDTO extends PartialType(PaginationDTO) {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsNumberString()
  applicationId?: string
}
