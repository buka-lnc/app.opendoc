import { TakeType } from '@miaooo/nestjs-take-type'
import { ForbiddenApplicationCode } from '../entities/forbidden-application-code.entity'

export class CreateForbiddenApplicationCodeDTO extends TakeType(
  ForbiddenApplicationCode,
  ['code'],
  []
) {
}
