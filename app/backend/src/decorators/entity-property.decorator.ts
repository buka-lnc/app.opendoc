import { Property, PropertyOptions } from '@mikro-orm/core'
import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'


export function EntityProperty<T extends object>(options?: PropertyOptions<T>) {
  const decorators: PropertyDecorator[] = [Property(options) as PropertyDecorator]

  if (options?.columnType && options.columnType.startsWith('varchar')) {
    const length = options.columnType.match(/\d+/)?.[0]
    if (length) {
      const len = Number(length)
      decorators.push(
        IsString(),
        MaxLength(len),
        ApiProperty({ maxLength: len })
      )
    }
  } else if (options?.type === 'varchar' && options.length) {
    decorators.push(
      IsString(),
      MaxLength(options.length),
      ApiProperty({ maxLength: options.length })
    )
  }

  if (options?.comment) {
    decorators.push(ApiProperty({ description: options.comment }))
  }

  return applyDecorators(...decorators)
}
