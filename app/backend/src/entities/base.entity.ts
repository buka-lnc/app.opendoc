import { OptionalProps, PrimaryKey, Property } from '@mikro-orm/core'

export abstract class BaseEntity<Optional = never> {
  [OptionalProps]?: 'createAt' | 'updateAt' | Optional

  @PrimaryKey({
    type: 'bigint',
    comment: '主键',
  })
  id!: string

  @Property({
    onCreate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createAt: Date = new Date()

  @Property({
    onUpdate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updateAt: Date = new Date()
}
