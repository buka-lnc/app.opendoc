import { TakeType } from '@miaooo/nestjs-take-type'
import { Sdk } from '../entities/sdk.entity'

export class UpdateSdkDTO extends TakeType(
  Sdk,
  ['id'],
  ['status']
) {
}
