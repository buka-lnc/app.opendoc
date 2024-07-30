import { PickType } from '@nestjs/swagger'
import { CompilerOption } from '../entities/compiler-option.entity'

export class UpdateCompilerOptionDTO extends PickType(CompilerOption, ['key', 'value']) {
}
