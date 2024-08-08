import { Cascade, Collection, Entity, OneToMany, Opt } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { PluginOption } from './plugin-option.entity'
import { EntityProperty } from '~/decorators/entity-property.decorator'
import { PluginStatus } from '../constants/plugin-status'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'
import { Sdk } from '~/modules/sdk/entities/sdk.entity'


@Entity()
export class Plugin extends BaseEntity {
  @IsEnum(PluginStatus)
  @EntityProperty({
    type: 'varchar',
    length: 15,
    comment: '编译器状态',
  })
  status!: PluginStatus

  @EntityProperty({
    type: 'varchar',
    length: 255,
    comment: '编译器地址',
    unique: true,
  })
  url!: string

  @EntityProperty({
    type: 'varchar',
    length: 63,
    comment: '编译器名称',
  })
  name!: string

  @EntityProperty({
    type: 'varchar',
    length: 255,
    comment: '编译器描述',
    default: '',
  })
  description: string & Opt = ''

  @EntityProperty({
    type: 'varchar',
    length: 63,
    comment: '编译器名称',
  })
  author: string & Opt = ''

  @EntityProperty({
    type: 'varchar',
    length: 31,
    comment: '编译器版本',
  })
  version!: string

  @ApiProperty({
    type: () => PluginOption,
    description: '编译器选项',
    isArray: true,
  })
  @OneToMany({
    entity: () => PluginOption,
    comment: '插件配置项',
    mappedBy: 'plugin',
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    eager: true,
    orderBy: { order: 'ASC' },
    hidden: false,
  })
  options: Collection<PluginOption> = new Collection<PluginOption>(this)

  @ApiForeignKey()
  @OneToMany({
    entity: () => Sdk,
    mappedBy: 'plugin',
    comment: 'sdks',
    cascade: [Cascade.ALL],
  })
  sdks: Collection<Sdk> = new Collection<Sdk>(this)
}
