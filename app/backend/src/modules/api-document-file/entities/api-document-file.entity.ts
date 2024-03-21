import { Entity, ManyToOne, OneToOne, Property, Ref, Unique } from '@mikro-orm/core'
import { IsString, MaxLength } from 'class-validator'
import { ApiDocument } from '../../api-document/entities/api-document.entity'
import { BaseEntity } from '~/entities/base.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Sdk } from '~/modules/sdk/entity/sdk.entity'

@Entity()
@Unique({ properties: ['apiDocument', 'version'] })
export class ApiDocumentFile extends BaseEntity {
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
    nullable: true,
    comment: '文档文件的标签',
  })
  tag?: string

  /**
   * 文档文件的版本
   */
  @IsString()
  @MaxLength(16)
  @Property({
    columnType: 'varchar(63)',
    comment: '文档文件的版本',
  })
  version: string = '1.0.0'

  @ApiProperty({
    type: () => ApiDocument,
  })
  @ManyToOne({
    entity: () => ApiDocument,
    comment: '文档',
    ref: true,
  })
  apiDocument!: Ref<ApiDocument>

  @ApiProperty({
    type: () => Sdk,
  })
  @OneToOne({
    entity: () => Sdk,
    comment: 'Npm 包',
    mappedBy: 'apiDocumentFile',
    ref: true,
  })
  sdk?: Ref<Sdk>
}
