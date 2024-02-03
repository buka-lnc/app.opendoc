import { Entity, Enum, ManyToOne, Property, Ref, Unique, t } from '@mikro-orm/core'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { Folder } from '~/modules/folder/entities/folder.entity'
import { API_DOCUMENT_TYPE } from '../constants/api-document-type.enum'


@Entity()
@Unique({ properties: ['code', 'folder'] })
export class ApiDocument extends BaseEntity {
  @IsEnum(API_DOCUMENT_TYPE)
  @Enum({
    items: () => API_DOCUMENT_TYPE,
    comment: '文档类型',
  })
  type: API_DOCUMENT_TYPE

  @IsString()
  @Property({
    columnType: 'varchar(32)',
    index: true,
    comment: '易于阅读的文档编码(Folder下唯一)',
  })
  code: string

  @IsString()
  @Property({
    type: t.integer,
    comment: '文档排序',
  })
  order: number = 1

  @IsString()
  @IsOptional()
  @Property({
    columnType: 'varchar(64)',
    comment: '文档名称',
  })
  title: string

  @ManyToOne({
    entity: () => Folder,
    comment: '文档所属的文件夹',
    ref: true,
  })
  folder: Ref<Folder>

  @Property({
    columnType: 'varchar(10)',
    comment: '文档文件的指纹',
  })
  hash: string = ''

  @Property({
    columnType: 'varchar(16)',
    comment: '文档文件的版本',
  })
  version: string = '0.0.0'

  @Property({
    columnType: 'varchar(255)',
    comment: '文档文件的定时同步地址',
    nullable: true,
  })
  cronSyncUrl?: string
}
