import { Entity, ManyToOne, Property, Ref, t } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { NpmPackage } from './npm-package.entity'

@Entity()
export class NpmPackageTime extends BaseEntity {
  @Property({
    columnType: 'varchar(255)',
    comment: 'Package tag',
  })
  tag!: string

  @Property({
    type: t.datetime,
    comment: 'Package publish time',
  })
  publishAt!: Date

  @ManyToOne({
    entity: () => NpmPackage,
  })
  npmPackage!: Ref<NpmPackage>
}
