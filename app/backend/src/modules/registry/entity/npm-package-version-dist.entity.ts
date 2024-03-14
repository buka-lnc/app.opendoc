import { Entity } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'

@Entity()
export class NpmPackageVersionDist extends BaseEntity {
  tarball!: string

  integrity!: string
}
