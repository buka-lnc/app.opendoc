import { Entity, ManyToOne, Ref, t } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { SdkStatus } from '../constant/sdk-status'
import { IsEnum } from 'class-validator'
import { Sheet } from '~/modules/sheet/entities/sheet.entity'
import { SheetVersion } from '~/modules/sheet-version/entities/sheet-version.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'
import { Compiler } from '~/modules/compiler/entities/compiler.entity'
import { EntityProperty } from '~/decorators/entity-property.decorator'

@Entity()
export class Sdk extends BaseEntity {
  @EntityProperty({
    columnType: 'varchar(63)',
    comment: 'sdk 名',
  })
  name!: string


  @EntityProperty({
    columnType: 'varchar(10)',
    comment: 'sdk 可用状态',
  })
  @IsEnum(SdkStatus)
  status!: SdkStatus

  @EntityProperty({
    type: t.datetime,
    nullable: true,
    comment: '发布时间',
  })
  publishedAt?: Date

  @ApiForeignKey()
  @ManyToOne({
    entity: () => Compiler,
    comment: '编译器',
  })
  compiler!: Compiler

  /**
   * 版本号
   */
  @ApiProperty({
    type: () => SheetVersion,
  })
  @ManyToOne({
    entity: () => SheetVersion,
    comment: '版本号',
    nullable: false,
    ref: true,
    eager: true,
  })
  version!: Ref<SheetVersion>

  /**
   * 所属文档
   */
  @ApiForeignKey()
  @ManyToOne({
    entity: () => Sheet,
    comment: '所属文档',
    ref: true,
  })
  sheet!: Ref<Sheet>
}
