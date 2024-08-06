import { Sdk } from '../entities/sdk.entity'


export class SdkCreatedEvent {
  constructor(
    public sdk: Sdk
  ) {
  }
}

