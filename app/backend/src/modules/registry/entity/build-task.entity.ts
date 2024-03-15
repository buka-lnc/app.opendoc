import { Entity, OneToOne, Ref } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { NpmPackage } from './npm-package.entity'

@Entity()
export class BuildTask extends BaseEntity {
  @OneToOne({
    entity: () => NpmPackage,
    unique: true,
    ref: true,
  })
  npmPackage!: Ref<NpmPackage>
}
