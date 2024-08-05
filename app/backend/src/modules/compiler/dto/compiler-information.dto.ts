import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CompilerOptionDefinition } from './compiler-option-definition'
import { TakeType } from '@miaooo/nestjs-take-type'
import { Compiler } from '../entities/compiler.entity'


export class CompilerInformation extends TakeType(
  Compiler,
  ['name', 'version'],
  ['description', 'author']
) {
  /**
   * Compiler 选项
   */
  @ValidateNested()
  @Type(() => CompilerOptionDefinition)
  options?: CompilerOptionDefinition[]
}
