import { Entity, ManyToOne, OneToOne, Opt, Property, Ref, t } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { ApiDocumentFile } from '~/modules/api-document-file/entities/api-document-file.entity'
import { SdkTask } from './sdk-task.entity'
import { ApiProperty } from '@nestjs/swagger'
import { ApiDocument } from '~/modules/api-document/entities/api-document.entity'

@Entity()
export class Sdk extends BaseEntity {
  @Property({
    columnType: 'varchar(63)',
    comment: 'organization',
  })
  scope!: string

  /**
   * Npm包名
   */
  @Property({
    columnType: 'varchar(63)',
    comment: 'Npm包名',
  })
  name!: string

  @ApiProperty({
    type: String,
    description: 'Npm完整包名',
  })
  @Property({ persist: false })
  get fullName(): Opt<string> {
    return `@${this.scope}/${this.name}`
  }

  /**
   * 版本
   */
  @Property({
    columnType: 'varchar(63)',
    comment: '版本',
  })
  version!: string

  /**
   * 标签
   */
  @Property({
    columnType: 'varchar(24)',
    nullable: true,
    comment: '标签',
  })
  tag?: string

  /**
   * 是否已发布
   */
  @Property({
    type: t.boolean,
  })
  isPublished!: boolean

  /**
   * 发布时间
   */
  @Property({
    type: t.datetime,
    nullable: true,
  })
  publishedAt?: Date

  /**
   * Npm 压缩包
   */
  @Property({
    columnType: 'varchar(255)',
    comment: 'Npm 压缩包',
    nullable: true,
  })
  tarball?: string

  /**
   * Npm 压缩包的sha512
   */
  @Property({
    columnType: 'varchar(100)',
    comment: 'Npm压缩包的sha512',
    nullable: true,
  })
  integrity?: string

  @ApiProperty({
    type: () => ApiDocument,
    description: '所属文档',
  })
  @ManyToOne({
    entity: () => ApiDocument,
    comment: '所属文档',
    ref: true,
  })
  apiDocument!: Ref<ApiDocument>

  @ApiProperty({
    type: () => ApiDocumentFile,
    description: '关联的文档文件',
  })
  @OneToOne({
    entity: () => ApiDocumentFile,
    comment: '关联的文档文件',
    ref: true,
  })
  apiDocumentFile!: Ref<ApiDocumentFile>

  @ApiProperty({
    type: () => SdkTask,
  })
  @OneToOne({
    entity: () => SdkTask,
    mappedBy: 'sdk',
    nullable: true,
  })
  sdkTask?: Ref<SdkTask>
}
