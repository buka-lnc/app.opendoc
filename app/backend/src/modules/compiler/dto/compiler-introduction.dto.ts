import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CompilerIntroductionOptionDTO } from './compiler-introduction-option.dto'
import { TakeType } from '@miaooo/nestjs-take-type'
import { Compiler } from '../entities/compiler.entity'


export class CompilerIntroductionDTO extends TakeType(
  Compiler,
  ['name', 'version'],
  ['description', 'author']
) {
  /**
   * Compiler 选项
   */
  @ValidateNested()
  @Type(() => CompilerIntroductionOptionDTO)
  options?: CompilerIntroductionOptionDTO[]
}
