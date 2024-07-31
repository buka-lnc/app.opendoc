import { Sheet } from '~/modules/sheet/entities/sheet.entity'
import { CompilerOption } from '../entities/compiler-option.entity'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'


export class CompileEventRequestData {
  @ValidateNested()
  sheet!: Sheet

  @ValidateNested({ each: true })
  @Type(() => CompilerOption)
  options!: CompilerOption[]
}
