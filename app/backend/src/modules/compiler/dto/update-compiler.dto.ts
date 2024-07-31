import { TakeType } from '@miaooo/nestjs-take-type'
import { UpdateCompilerOptionDTO } from './update-compiler-option.dto'
import { Compiler } from '../entities/compiler.entity'

export class UpdateCompilerDTO extends TakeType(
  Compiler,
  [],
  ['status']
) {
  options?: UpdateCompilerOptionDTO[]
}
