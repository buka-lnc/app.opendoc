import { IsNumber } from 'class-validator'

export class PaginationDTO {
  /**
   * @default 10
   */
  @IsNumber()
  limit: number

  /**
   * @default 0
   */
  @IsNumber()
  offset: number
}
