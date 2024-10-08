import { Entity, EntityRepositoryType, Hidden, ManyToOne, Property, Ref, Unique } from '@mikro-orm/core'
import { IsString, MaxLength } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { Sheet } from '~/modules/sheet/entities/sheet.entity'
import { SheetVersion } from '~/modules/sheet-version/entities/sheet-version.entity'
import { ApiForeignKey } from '~/decorators/api-reference.decorator'
import revisionHash from 'rev-hash'
import { ApiFileRepository } from '../repository/api-file.repository'
import { ApiHideProperty } from '@nestjs/swagger'

@Entity({ repository: () => ApiFileRepository })
@Unique({ properties: ['sheet', 'version', 'path'] })
export class ApiFile extends BaseEntity {
  [EntityRepositoryType]?: ApiFileRepository

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

  @ApiForeignKey()
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
  private __raw__: Buffer | null = null

  set raw(value: Buffer) {
    this.hash = revisionHash(value)
    this.__raw__ = value
  }

  /**
   * !!! Don't use this field directly, use `ApiFileStorage.readFile` instead
   */
  @Property({ persist: false, hidden: true })
  get raw(): (Buffer | null) & Hidden {
    return this.__raw__!
  }
}

