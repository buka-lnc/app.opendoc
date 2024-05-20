import { ResponseOfPaginationDTO } from '~/dto/response-of-pagination.dto'
import { SheetVersion } from '../entity/sheet-version.entity'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export class QuerySheetVersionsResponseDTO {
  @Type(() => SheetVersion)
  @ValidateNested({ each: true })
  results!: SheetVersion[]

  @Type(() => ResponseOfPaginationDTO)
  @ValidateNested({ each: true })
  pagination!: ResponseOfPaginationDTO
}
