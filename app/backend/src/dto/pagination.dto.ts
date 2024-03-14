import { ToNumber } from '@buka/class-transformer-extra'
import { IsInt } from 'class-validator'

export class PaginationDTO {
  /**
   * @default 10
   */
  @ToNumber()
  @IsInt()
  limit!: number

  /**
   * @default 0
   */
  @ToNumber()
  @IsInt()
  offset!: number
}
