import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { NpmPackage } from './npm-package.entity'

@Entity()
export class NpmPackageDistTag extends BaseEntity {
  @Property({
    columnType: 'varchar(255)',
    comment: 'Npm包名',
  })
  name: string

  @Property({
    columnType: 'varchar(64)',
    comment: 'Npm包版本',
  })
  version: string

  @ManyToOne({
    entity: () => NpmPackage,
  })
  npmPackage: Ref<NpmPackage>
}
