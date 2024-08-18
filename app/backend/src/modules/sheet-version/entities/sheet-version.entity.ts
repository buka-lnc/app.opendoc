import { Cascade, Collection, Entity, EntityRepositoryType, ManyToOne, OneToMany, Opt, Ref, Unique } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { IsInt, IsString, MaxLength } from 'class-validator'
import { ApiFile } from '~/modules/api-file/entities/api-file.entity'
import { Sdk } from '~/modules/sdk/entities/sdk.entity'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Sheet } from '~/modules/sheet/entities/sheet.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'
import { SheetVersionRepository } from '../repository/sheet-version.repository'
import { EntityProperty } from '~/decorators/entity-property.decorator'


@Entity({ repository: () => SheetVersionRepository })
@Unique({ properties: ['sheet', 'major', 'minor', 'patch', 'tag', 'prerelease'] })
export class SheetVersion extends BaseEntity {
  [EntityRepositoryType]?: SheetVersionRepository

  @IsInt()
  @EntityProperty({
    type: 'int',
    comment: 'Major/主版本号',
  })
  major!: number

  @IsInt()
  @EntityProperty({
    type: 'int',
    comment: 'Minor/次版本号',
  })
  minor!: number

  @IsInt()
  @EntityProperty({
    type: 'int',
    comment: 'Patch/修订号',
  })
  patch!: number

  @IsInt()
  @EntityProperty({
    type: 'int',
    comment: 'Pre-release/预发布号',
    default: 0,
  })
  prerelease!: number

  /**
   * 标签
   * @example "latest"
   */
  @MaxLength(24)
  @IsString()
  @EntityProperty({
    columnType: 'varchar(24)',
    comment: '标签',
    default: '',
  })
  tag!: string

  @ApiForeignKey()
  @ManyToOne({
    entity: () => Sheet,
    ref: true,
  })
  sheet!: Ref<Sheet>

  @ApiHideProperty()
  @OneToMany({
    entity: () => ApiFile,
    mappedBy: 'version',
    comment: '文件',
    cascade: [Cascade.ALL],
  })
  apiFiles!: Collection<ApiFile>

  @ApiHideProperty()
  @OneToMany({
    entity: () => Sdk,
    mappedBy: 'version',
    comment: 'sdk',
    cascade: [Cascade.ALL],
  })
  sdks!: Collection<Sdk>

  @ApiProperty({
    type: 'string',
    description: '版本号',
  })
  @EntityProperty({ persist: false })
  get string(): string & Opt {
    return `${this.major}.${this.minor}.${this.patch}${this.tag ? `-${this.tag}.${this.prerelease}` : ''}`
  }
}
