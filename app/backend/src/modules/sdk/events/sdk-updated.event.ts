import { Sdk } from '../entities/sdk.entity'


export class SdkUpdatedEvent {
  constructor(
    public sdk: Sdk
  ) {
  }
}

