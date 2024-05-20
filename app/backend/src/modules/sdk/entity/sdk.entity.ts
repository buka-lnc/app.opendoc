import { Cascade, Entity, ManyToOne, OneToOne, Opt, Property, Ref, t } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { SdkPublishLock } from './sdk-publish-lock.entity'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { SdkStatus } from '../constant/sdk-status'
import { IsEnum } from 'class-validator'
import { SdkCompiler } from '../constant/sdk-compiler'
import { Sheet } from '~/modules/sheet/entity/sheet.entity'
import { ApiFile } from '~/modules/api-file/entities/api-file.entity'
import { SheetVersion } from '~/modules/sheet-version/entity/sheet-version.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'

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

  @Property({
    columnType: 'varchar(24)',
    comment: '编译器',
  })
  compiler!: SdkCompiler

  /**
   * sdk 可用状态
   */
  @Property({
    columnType: 'varchar(10)',
  })
  @IsEnum(SdkStatus)
  status!: SdkStatus

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
    lazy: false,
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

  /**
   * 关联的文档文件
   */
  @ApiForeignKey()
  @ManyToOne({
    entity: () => ApiFile,
    comment: '关联的文档文件',
    ref: true,
  })
  apiFile!: Ref<ApiFile>

  @ApiHideProperty()
  @OneToOne({
    entity: () => SdkPublishLock,
    mappedBy: 'sdk',
    nullable: true,
    hidden: true,
    cascade: [Cascade.ALL],
  })
  sdkPublishLock?: Ref<SdkPublishLock>
}
