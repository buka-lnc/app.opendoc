import { Cascade, Collection, Entity, EntityRepositoryType, Enum, ManyToOne, OneToMany, OneToOne, Opt, Property, Ref, Unique, t } from '@mikro-orm/core'
import { IsEnum, IsInt, IsOptional, IsString, Matches, MaxLength } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { SheetMode } from '../constants/sheet-mode.enum'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Application } from '~/modules/application/entities/application.entity'
import { Sdk } from '~/modules/sdk/entities/sdk.entity'
import { ApiFile } from '~/modules/api-file/entities/api-file.entity'
import { SheetType } from '../constants/sheet-type.enum'
import { SheetPullCrontab } from './sheet-pull-crontab.entity'
import { SheetVersion } from '~/modules/sheet-version/entities/sheet-version.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'
import { SheetRepository } from '../repository/sheet.repository'


@Entity({ repository: () => SheetRepository })
@Unique({ properties: ['code', 'application'] })
export class Sheet extends BaseEntity {
  [EntityRepositoryType]?: SheetRepository

  /**
   * 文档名称
   */
  @IsString()
  @MaxLength(128)
  @IsOptional()
  @Property({
    columnType: 'varchar(127)',
    comment: '文档名称',
  })
  title: string = ''

  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  @IsString()
  @MaxLength(64)
  @Matches(/^[a-z0-9-]+$/)
  @Property({
    columnType: 'varchar(63)',
    index: true,
    comment: '易于阅读的文档编码(Folder下唯一)',
  })
  code!: string

  /**
   * 文档排序
   */
  @IsInt()
  @Property({
    type: t.integer,
    comment: '文档排序',
    default: 1,
  })
  order: number & Opt = 1

  /**
   * 文档类型
   *
   * @example "openapi"
   */
  @IsEnum(SheetType)
  @Enum({
    items: () => SheetType,
    comment: '文档类型',
  })
  type!: SheetType

  @IsEnum(SheetMode)
  @IsOptional()
  @ApiProperty({ enum: SheetMode })
  @Property({
    columnType: 'varchar(31)',
    comment: '文档同步模式',
    default: SheetMode.PUSH,
  })
  mode: SheetMode & Opt = SheetMode.PUSH

  /**
   * 文档文件的定时同步地址
   */
  @ApiProperty({
    type: () => SheetPullCrontab,
  })
  @OneToOne({
    entity: () => SheetPullCrontab,
    comment: '文档文件的定时同步地址',
    cascade: [Cascade.ALL],
    mappedBy: 'sheet',
    orphanRemoval: true,
    ref: false,
    eager: true,
  })
  pullCrontab?: SheetPullCrontab & Opt

  @ApiHideProperty()
  @OneToMany({
    entity: () => SheetVersion,
    mappedBy: 'sheet',
    comment: '版本表',
    cascade: [Cascade.ALL],
  })
  versions: Collection<SheetVersion> = new Collection<SheetVersion>(this)

  /**
   * 文档所属的应用
   */
  @ApiForeignKey()
  @ManyToOne({
    entity: () => Application,
    comment: '文档所属的应用',
    ref: true,
  })
  application!: Ref<Application>

  // @ApiProperty({
  //   type: () => ApiFile,
  //   isArray: true,
  // })
  @ApiHideProperty()
  @OneToMany({
    entity: () => ApiFile,
    mappedBy: 'sheet',
    comment: '文档文件',
    cascade: [Cascade.ALL],
  })
  apiFiles!: Collection<ApiFile>

  @ApiHideProperty()
  @OneToMany({
    entity: () => Sdk,
    mappedBy: 'sheet',
    comment: 'Npm 包',
    cascade: [Cascade.ALL],
  })
  sdks!: Collection<Sdk>
}
