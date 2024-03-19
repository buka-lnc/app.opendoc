import { Entity, OneToOne, Ref } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { Sdk } from './sdk.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class SdkTask extends BaseEntity {
  @ApiProperty({
    type: () => Sdk,
  })
  @OneToOne({
    entity: () => Sdk,
    unique: true,
    ref: true,
  })
  sdk!: Ref<Sdk>
}
