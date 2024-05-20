import { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Type as ClassType } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { ResponseOfPaginationDTO } from '~/dto/response-of-pagination.dto'


export function ResponseOfType<T>(classRef: Type<T>): Type<{
  results: T[]
  pagination: ResponseOfPaginationDTO
}> {
  abstract class ResponseOfTypeClass {
    @ApiProperty({
      type: () => classRef,
      isArray: true,
    })
    @ClassType(() => classRef)
    @ValidateNested({ each: true })
    results!: T[]

    @ApiProperty({
      type: () => ResponseOfPaginationDTO,
    })
    @ClassType(() => ResponseOfPaginationDTO)
    @ValidateNested()
    pagination!: ResponseOfPaginationDTO
  }

  return ResponseOfTypeClass as Type<{
    results: T[]
    pagination: ResponseOfPaginationDTO
  }>
}
