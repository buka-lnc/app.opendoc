import { Cascade, Collection, Entity, EntityRepositoryType, OneToMany, Property } from '@mikro-orm/core'
import { ApiHideProperty } from '@nestjs/swagger'
import { Matches, MaxLength } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { Sheet } from '~/modules/sheet/entities/sheet.entity'
import { ApplicationRepository } from '../repository/application.repository'

@Entity({ repository: () => ApplicationRepository })
export class Application extends BaseEntity {
  [EntityRepositoryType]?: ApplicationRepository

  /**
   * 唯一应用编码
   */
  @MaxLength(64)
  @Matches(/^[a-z0-9-]+$/)
  @Property({
    columnType: 'varchar(63)',
    unique: true,
    comment: '唯一应用编码',
  })
  code!: string

  /**
   * 应用名称
   */
  @Property({
    columnType: 'varchar(127)',
    comment: '应用名称',
  })
  title!: string

  @ApiHideProperty()
  @OneToMany({
    entity: () => Sheet,
    mappedBy: 'application',
    cascade: [Cascade.ALL],
  })
  sheets!: Collection<Sheet>
}
