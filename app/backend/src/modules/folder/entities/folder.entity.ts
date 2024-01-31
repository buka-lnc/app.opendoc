import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { IsString } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { Document } from '~/modules/document/entities/document.entity'


@Entity()
export class Folder extends BaseEntity {
  @IsString()
  @Property({
    columnType: 'varchar(32)',
    index: true,
    comment: '易于阅读的文件夹编码(同层级唯一)',
  })
  code: string

  @IsString()
  @Property({
    columnType: 'varchar(512)',
    unique: true,
    comment: '文件夹路径',
  })
  mpath: string

  @IsString()
  @Property({
    columnType: 'varchar(64)',
    comment: '文件夹名称',
  })
  title: string = ''

  @OneToMany({
    entity: () => Document,
    mappedBy: 'folder',
  })
  documents: Collection<Document>
}

