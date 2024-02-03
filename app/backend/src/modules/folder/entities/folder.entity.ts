import { BeforeCreate, BeforeUpdate, Collection, Entity, EventArgs, OneToMany, Property } from '@mikro-orm/core'
import { IsString } from 'class-validator'
import { BaseEntity } from '~/entities/base.entity'
import { ApiDocument } from '~/modules/api-document/entities/api-document.entity'


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
  title: string

  @OneToMany({
    entity: () => ApiDocument,
    mappedBy: 'folder',
  })
  documents: Collection<ApiDocument>

  @BeforeCreate()
  @BeforeUpdate()
  fixMpath(args: EventArgs<Folder>) {
    const mpath = args.changeSet.payload.mpath
    if (mpath && !mpath.endsWith('/')) {
      args.changeSet.payload.mpath = `${mpath}/`
    }
  }
}

