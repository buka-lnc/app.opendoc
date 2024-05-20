import { IsNumber } from 'class-validator'
import { PaginationDTO } from './pagination.dto'

export class ResponseOfPaginationDTO extends PaginationDTO {
  /**
   * 总数
   */
  @IsNumber()
  total!: number
}
