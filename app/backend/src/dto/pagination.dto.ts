import { ToNumber } from '@buka/class-transformer-extra'
import { IsInt, Min } from 'class-validator'

export class PaginationDTO {
  /**
   * @default 10
   */
  @ToNumber()
  @IsInt()
  @Min(1)
  limit!: number

  /**
   * @default 0
   */
  @ToNumber()
  @IsInt()
  @Min(0)
  offset!: number
}
