import { Cascade, Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { CompilerOption } from './compiler-option.entity'


@Entity()
export class Compiler extends BaseEntity {
  @Property({
    columnType: 'varchar(15)',
    comment: '编译器状态',
  })
  status!: 'disabled' | 'enabled'

  @Property({
    columnType: 'varchar(255)',
    comment: '编译器地址',
    unique: true,
  })
  url!: string

  @Property({
    columnType: 'varchar(63)',
    comment: '编译器名称',
  })
  name!: string

  @Property({
    columnType: 'varchar(63)',
    comment: '编译器名称',
  })
  author!: string

  @Property({
    columnType: 'varchar(31)',
    comment: '编译器版本',
  })
  version!: string

  @OneToMany({
    entity: () => CompilerOption,
    comment: '编译器选项',
    mappedBy: 'compiler',
    cascade: [Cascade.ALL],
    eager: true,
  })
  options = new Collection<CompilerOption>(this)
}
