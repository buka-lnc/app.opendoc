import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property, Ref, Unique } from '@mikro-orm/core'
import { IsString, MaxLength } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Sdk } from '~/modules/sdk/entity/sdk.entity'
import { Sheet } from '~/modules/sheet/entity/sheet.entity'
import { SheetVersion } from '~/modules/sheet-version/entity/sheet-version.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'

@Entity()
@Unique({ properties: ['sheet', 'version', 'path'] })
export class ApiFile extends BaseEntity {
  /**
   * 文件的路径
   */
  @MaxLength(128)
  @IsString()
  @Property({
    columnType: 'varchar(128)',
    comment: '文件的路径',
  })
  path!: string

  /**
   * 文件的指纹
   */
  @MaxLength(10)
  @IsString()
  @Property({
    columnType: 'varchar(10)',
    comment: '文件的指纹',
  })
  hash: string = ''

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

  @ApiForeignKey()
  @ManyToOne({
    entity: () => Sheet,
    comment: 'Sheet',
    ref: true,
  })
  sheet!: Ref<Sheet>

  @ApiHideProperty()
  @OneToMany({
    entity: () => Sdk,
    comment: 'Npm 包',
    mappedBy: 'apiFile',
    cascade: [Cascade.ALL],
  })
  sdks = new Collection<Sdk>(this)
}

