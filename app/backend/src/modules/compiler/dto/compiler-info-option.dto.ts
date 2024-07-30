import { CompilerOption } from '../entities/compiler-option.entity'
import { TakeType } from '@miaooo/nestjs-take-type'


export class CompilerInfoOptionDTO extends TakeType(
  CompilerOption,
  ['key', 'format', 'value'],
  ['label', 'description'],
) {
}
