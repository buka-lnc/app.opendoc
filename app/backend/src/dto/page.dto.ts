import { IsNumber } from 'class-validator'

export class PageDTO {
  @IsNumber()
  limit: number

  @IsNumber()
  offset: number

  @IsNumber()
  total: number
}
