import { ApiProperty } from '@nestjs/swagger'
import { EntityReferenceDTO } from '~/dto/entity-reference.dto'
import { Collection } from '@mikro-orm/core'


export function ApiForeignKey(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey)

    // 对于 Collection<Entity> 类型的属性，不要省略类型声明(`: Collection<Entity>`)
    // property: Collection<Entity> = new Collection<Entity>(this)
    // 省略会导致无法正确的判定 Array 类型，从而导致 swagger 生成错误的文档

    const isArray = type === Collection

    return ApiProperty({
      type: () => EntityReferenceDTO,
      isArray,
    })(target, propertyKey)
  }
}
