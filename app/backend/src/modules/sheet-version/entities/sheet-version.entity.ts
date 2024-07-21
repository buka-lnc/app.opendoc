import { Cascade, Collection, Entity, ManyToOne, OneToMany, Opt, Property, Ref, Unique } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { IsInt, IsString, MaxLength } from 'class-validator'
import { ApiFile } from '~/modules/api-file/entities/api-file.entity'
import { Sdk } from '~/modules/sdk/entities/sdk.entity'
import { ApiHideProperty } from '@nestjs/swagger'
import { Sheet } from '~/modules/sheet/entities/sheet.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'


@Entity()
@Unique({ properties: ['sheet', 'major', 'minor', 'patch', 'tag', 'prerelease'] })
export class SheetVersion extends BaseEntity {
  @IsInt()
  @Property({
    type: 'int',
    comment: 'Major',
  })
  major!: number

  @IsInt()
  @Property({
    type: 'int',
    comment: 'Minor',
  })
  minor!: number

  @IsInt()
  @Property({
    type: 'int',
    comment: 'Patch',
  })
  patch!: number

  @IsInt()
  @Property({
    type: 'int',
    comment: 'Pre-release',
    default: 0,
  })
  prerelease!: number

  /**
   * 标签
   * @example "latest"
   */
  @MaxLength(24)
  @IsString()
  @Property({
    columnType: 'varchar(24)',
    comment: '标签',
    default: '',
  })
  tag!: string

  @Property({
    persist: false,
    comment: '版本号',
  })
  get version(): string & Opt {
    return `${this.major}.${this.minor}.${this.patch}${this.tag ? `-${this.tag}.${this.prerelease}` : ''}`
  }

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
}
