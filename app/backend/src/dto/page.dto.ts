import { IsNumber } from 'class-validator'

export class PageDTO {
  /**
   * 每页的数量
   */
  @IsNumber()
  limit!: number

  /**
   * 当前页的偏移量
   */
  @IsNumber()
  offset!: number

  /**
   * 总数
   */
  @IsNumber()
  total!: number
}
