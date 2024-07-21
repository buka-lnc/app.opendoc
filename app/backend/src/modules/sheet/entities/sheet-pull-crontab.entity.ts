import { Entity, HiddenProps, OneToOne, Property, Ref } from '@mikro-orm/core'
import { IsString } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { Sheet } from './sheet.entity'
import { ApiHideProperty } from '@nestjs/swagger'


@Entity()
export class SheetPullCrontab extends BaseEntity {
  [HiddenProps]?: 'id' | 'createAt' | 'updateAt'

  @IsString()
  @Property({
    columnType: 'varchar(255)',
    comment: '接口地址',
  })
  url!: string

  @ApiHideProperty()
  @OneToOne({
    entity: () => Sheet,
    nullable: false,
    owner: true,
    ref: true,
  })
  sheet!: Ref<Sheet>
}
