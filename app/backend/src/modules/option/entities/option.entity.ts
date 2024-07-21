import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'


@Entity()
export class Option extends BaseEntity {
  @Property({
    columnType: 'varchar(63)',
    comment: '键',
  })
  key!: string

  @Property({
    type: 'json',
    comment: '值',
  })
  value!: string
}
