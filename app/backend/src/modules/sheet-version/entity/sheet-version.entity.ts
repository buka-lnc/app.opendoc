import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property, Ref, Unique } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { IsSemVer, IsString, MaxLength } from 'class-validator'
import { ApiFile } from '~/modules/api-file/entities/api-file.entity'
import { Sdk } from '~/modules/sdk/entity/sdk.entity'
import { ApiHideProperty } from '@nestjs/swagger'
import { Sheet } from '~/modules/sheet/entity/sheet.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'


@Entity()
@Unique({ properties: ['sheet', 'version'] })
export class SheetVersion extends BaseEntity {
  @IsSemVer()
  @Property({
    columnType: 'varchar(63)',
    comment: '版本号',
  })
  version!: string

  /**
   * 标签
   * @example "latest"
   */
  @MaxLength(24)
  @IsString()
  @Property({
    columnType: 'varchar(24)',
    nullable: true,
    comment: '标签',
  })
  tag?: string

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
