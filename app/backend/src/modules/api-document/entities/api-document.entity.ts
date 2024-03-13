import { Entity, Enum, ManyToOne, Property, Ref, Unique, t } from '@mikro-orm/core'
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { API_DOCUMENT_TYPE } from '../constants/api-document-type.enum'
import { Application } from '~/modules/application/entity/application.entity'


@Entity()
@Unique({ properties: ['application', 'code'] })
export class ApiDocument extends BaseEntity {
  /**
   * 文档类型
   *
   * @example "openapi"
   */
  @IsEnum(API_DOCUMENT_TYPE)
  @Enum({
    items: () => API_DOCUMENT_TYPE,
    comment: '文档类型',
  })
  type: API_DOCUMENT_TYPE

  /**
   * 易于阅读的文档编码(Folder下唯一)
   */
  @IsString()
  @MaxLength(64)
  @Property({
    columnType: 'varchar(63)',
    index: true,
    comment: '易于阅读的文档编码(Folder下唯一)',
  })
  code: string

  /**
   * 文档排序
   */
  @IsString()
  @Property({
    type: t.integer,
    comment: '文档排序',
  })
  order: number = 1

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
   * 文档所属的应用
   */
  @ManyToOne({
    entity: () => Application,
    comment: '文档所属的应用',
    ref: true,
  })
  application: Ref<Application>

  /**
   * 文档文件的指纹
   */
  @MaxLength(10)
  @IsString()
  @Property({
    columnType: 'varchar(10)',
    comment: '文档文件的指纹',
  })
  hash: string = ''

  /**
   * 文档文件的标签
   * @example "latest"
   */
  @MaxLength(24)
  @IsString()
  @Property({
    columnType: 'varchar(24)',
    comment: '文档文件的标签',
  })
  tag: string = 'latest'

  /**
   * 文档文件的版本
   */
  @IsString()
  @MaxLength(16)
  @Property({
    columnType: 'varchar(15)',
    comment: '文档文件的版本',
  })
  version: string = '1.0.0'

  /**
   * 文档文件的定时同步地址
   */
  @IsString()
  @MaxLength(255)
  @Property({
    columnType: 'varchar(255)',
    comment: '文档文件的定时同步地址',
    nullable: true,
  })
  cronSyncUrl?: string
}
