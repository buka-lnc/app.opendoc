import { Collection, Entity, Enum, ManyToOne, OneToMany, Property, Ref, Unique, t } from '@mikro-orm/core'
import { IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { API_DOCUMENT_TYPE } from '../constants/api-document-type.enum'
import { Application } from '~/modules/application/entity/application.entity'
import { ApiDocumentFile } from '../../api-document-file/entities/api-document-file.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Sdk } from '~/modules/sdk/entity/sdk.entity'


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
  type!: API_DOCUMENT_TYPE

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

  /**
   * 文档所属的应用
   */
  @ApiProperty({
    type: () => Application,
  })
  @ManyToOne({
    entity: () => Application,
    comment: '文档所属的应用',
    ref: true,
  })
  application!: Ref<Application>

  @ApiProperty({
    type: () => ApiDocumentFile,
    isArray: true,
  })
  @OneToMany({
    entity: () => ApiDocumentFile,
    mappedBy: 'apiDocument',
    comment: '文档文件',
  })
  apiDocumentFiles!: Collection<ApiDocumentFile>

  @ApiProperty({
    type: () => Sdk,
    isArray: true,
  })
  @OneToMany({
    entity: () => Sdk,
    mappedBy: 'apiDocument',
    comment: 'Npm 包',
  })
  sdks!: Collection<Sdk>
}
