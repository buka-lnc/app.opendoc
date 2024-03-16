import { Entity, ManyToOne, OneToOne, Opt, Property, Ref, t } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { ApiDocumentFile } from '~/modules/api-document-file/entities/api-document-file.entity'
import { BuildTask } from './build-task.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class NpmPackage extends BaseEntity {
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
    default: '',
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
    type: () => ApiDocumentFile,
  })
  @ManyToOne({
    entity: () => ApiDocumentFile,
    comment: '文档文件',
    ref: true,
  })
  apiDocumentFile!: Ref<ApiDocumentFile>

  @ApiProperty({
    type: () => BuildTask,
  })
  @OneToOne({
    entity: () => BuildTask,
    mappedBy: 'npmPackage',
    nullable: true,
  })
  BuildTask?: Ref<BuildTask>
}
