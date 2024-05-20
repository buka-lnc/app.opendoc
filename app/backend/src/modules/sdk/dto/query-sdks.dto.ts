import { PartialType } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsSemVer } from 'class-validator'
import { PaginationDTO } from '~/dto/pagination.dto'

export class QuerySdksDTO extends PartialType(PaginationDTO) {
  @IsNumberString()
  @IsOptional()
  sheetId?: string

  @IsSemVer()
  @IsOptional()
  version?: string
}
