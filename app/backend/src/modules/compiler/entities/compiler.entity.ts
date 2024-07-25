import { Entity, Property } from '@mikro-orm/core'
import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from '~/entities/base.entity'


@Entity()
export class Compiler extends BaseEntity {
  @ApiProperty({
    description: 't1',
  })
  @Property({
    columnType: 'varchar(12)',
    comment: '编译器状态',
  })
  status!: 'disabled' | 'enabled'

  @ApiProperty({
    description: 't2',
  })
  @Property({
    columnType: 'varchar(255)',
    comment: '编译器地址',
    unique: true,
  })
  url!: string
}
