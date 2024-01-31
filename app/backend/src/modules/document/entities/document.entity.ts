import { Entity, Enum, ManyToOne, Property, Ref, Unique } from '@mikro-orm/core'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { Folder } from '~/modules/folder/entities/folder.entity'
import { DOCUMENT_TYPE } from '../constants/document-type.enum'


@Entity()
@Unique({ properties: ['code', 'folder' ]})
export class Document extends BaseEntity {
  @IsEnum(DOCUMENT_TYPE)
  @Enum({
    items: () => DOCUMENT_TYPE,
    comment: '文档类型',
  })
  type: DOCUMENT_TYPE

  @IsString()
  @Property({
    columnType: 'varchar(32)',
    index: true,
    comment: '易于阅读的文档编码(Folder下唯一)'
  })
  code: string

  @IsString()
  @IsOptional()
  @Property({
    columnType: 'varchar(64)',
    comment: '文档名称',
  })
  title: string = ''

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
  hash: string

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
