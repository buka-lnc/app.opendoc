import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'

@Entity()
export class NpmPackageVersion extends BaseEntity {
  @Property()
  name!: string

  @Property()
  version!: string
}
