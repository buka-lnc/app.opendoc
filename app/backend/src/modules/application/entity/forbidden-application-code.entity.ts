import { Entity, Property } from '@mikro-orm/core'
import { IsString, MaxLength } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'

/**
 * 应用编码黑名单
 */
@Entity()
export class ForbiddenApplicationCode extends BaseEntity {
  @IsString()
  @MaxLength(64)
  @Property({
    type: 'varchar(63)',
    unique: true,
    comment: '唯一应用编码',
  })
  code!: string
}
