import { PickType } from '@nestjs/swagger'
import { Compiler } from '../entities/compiler.entity'


export class CreateCompilerDTO extends PickType(Compiler, ['url']) {
}
