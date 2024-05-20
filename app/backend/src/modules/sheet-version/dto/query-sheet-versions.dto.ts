import { PartialType } from '@nestjs/swagger'
import { IsNumberString } from 'class-validator'
import { PaginationDTO } from '~/dto/pagination.dto'


export class QuerySheetVersionsDTO extends PartialType(PaginationDTO) {
  @IsNumberString()
  sheetId!: string
}
