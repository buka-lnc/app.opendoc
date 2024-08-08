import { Cascade, Collection, Entity, OneToMany, Opt } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { CompilerOption } from './compiler-option.entity'
import { EntityProperty } from '~/decorators/entity-property.decorator'
import { CompilerStatus } from '../constants/compiler-status'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'
import { Sdk } from '~/modules/sdk/entities/sdk.entity'


@Entity()
export class Compiler extends BaseEntity {
  @IsEnum(CompilerStatus)
  @EntityProperty({
    type: 'varchar',
    length: 15,
    comment: '编译器状态',
  })
  status!: CompilerStatus

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
    type: () => CompilerOption,
    description: '编译器选项',
    isArray: true,
  })
  @OneToMany({
    entity: () => CompilerOption,
    comment: '编译器选项',
    mappedBy: 'compiler',
    cascade: [Cascade.ALL],
    eager: true,
    orphanRemoval: true,
    orderBy: { order: 'ASC' },
  })
  options: Collection<CompilerOption> = new Collection<CompilerOption>(this)

  @ApiForeignKey()
  @OneToMany({
    entity: () => Sdk,
    mappedBy: 'compiler',
    comment: 'sdks',
    cascade: [Cascade.ALL],
  })
  sdks: Collection<Sdk> = new Collection<Sdk>(this)
}
