import { Config, DefineConfig, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core'

export abstract class BaseEntity<Optional = never> {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional
  [Config]?: DefineConfig<{ forceObject: true }>


  /**
   * 主键
   */
  @PrimaryKey({
    type: 'bigint',
    comment: '主键',
  })
  id!: string

  /**
   * 创建时间
   */
  @Property({
    onCreate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt!: Date

  /**
   * 更新时间
   */
  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt!: Date
}
