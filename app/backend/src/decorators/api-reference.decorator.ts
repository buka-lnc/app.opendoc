import { ApiProperty } from '@nestjs/swagger'
import { EntityReferenceDTO } from '~/dto/entity-reference.dto'
import { Collection } from '@mikro-orm/core'


export function ApiForeignKey(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey)

    const isArray = type === Collection

    return ApiProperty({
      type: () => EntityReferenceDTO,
      isArray,
    })(target, propertyKey)
  }
}
