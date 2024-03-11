import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { NpmPackageTime } from './npm-package-time.entity'
import { NpmPackageDistTag } from './npm-package-dist-tag.entity'

@Entity()
export class NpmPackage extends BaseEntity {
  @Property({
    columnType: 'varchar(214)',
    comment: 'Npm包名',
  })
  name: string

  // @Property({
  //   columnType: 'varchar(512)',
  //   comment: 'Npm包描述',
  // })
  // description: string

  @OneToMany({
    entity: () => NpmPackageDistTag,
    mappedBy: 'npmPackage',
  })
  distTags: Collection<NpmPackageDistTag>

  @OneToMany({
    entity: () => NpmPackageTime,
    mappedBy: 'npmPackage',
  })
  times: Collection<NpmPackageTime>
}
