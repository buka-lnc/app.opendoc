import { ResponseOfType } from '~/type-helpers/response-of'
import { Compiler } from '../entities/compiler.entity'

export class ResponseOfQueryCompilerDTO extends ResponseOfType(Compiler) {
}
