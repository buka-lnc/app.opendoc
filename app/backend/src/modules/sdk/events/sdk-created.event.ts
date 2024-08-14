import { EntityDTO, Loaded } from '@mikro-orm/core'
import { Sdk } from '../entities/sdk.entity'


export class SdkCreatedEvent {
  constructor(
    public sdk: EntityDTO<Loaded<Sdk>>,
  ) {
  }
}

