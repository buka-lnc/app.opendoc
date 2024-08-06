import { Entity, ManyToOne, Ref, Unique } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { Compiler } from './compiler.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'
import { CompilerOptionFormat } from '../constants/compiler-option-format'
import { EntityProperty } from '~/decorators/entity-property.decorator'


@Entity()
@Unique({ properties: ['key', 'compiler'] })
export class CompilerOption extends BaseEntity {
  @EntityProperty({
    columnType: 'varchar(63)',
    comment: '选项键',
  })
  key!: string

  @EntityProperty({
    columnType: 'int',
    comment: '选项排序',
  })
  order!: number

  @EntityProperty({
    columnType: 'varchar(63)',
    comment: '选项名',
  })
  label!: string


  @EntityProperty({
    columnType: 'varchar(255)',
    comment: '选项描述',
    default: '',
  })
  description!: string

  @EntityProperty({
    columnType: 'varchar(31)',
    comment: '选项格式',
  })
  format!: CompilerOptionFormat

  @EntityProperty({
    columnType: 'varchar(255)',
    comment: '选项值',
    nullable: true,
  })
  value?: string

  @ApiForeignKey()
  @ManyToOne({
    entity: () => Compiler,
    comment: 'Compiler',
    ref: true,
  })
  compiler!: Ref<Compiler>
}
