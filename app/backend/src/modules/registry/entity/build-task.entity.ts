import { Entity, OneToOne, Ref } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { NpmPackage } from './npm-package.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class BuildTask extends BaseEntity {
  @ApiProperty({
    type: () => NpmPackage,
  })
  @OneToOne({
    entity: () => NpmPackage,
    unique: true,
    ref: true,
  })
  npmPackage!: Ref<NpmPackage>
}
