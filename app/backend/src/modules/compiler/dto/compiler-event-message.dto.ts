import { IsEnum, IsString } from 'class-validator'
import { CompilerEvent } from '../constants/compiler-message-event'

export class CompilerEventMessageDTO {
  @IsString()
  id!: string

  @IsEnum(CompilerEvent)
  event!: CompilerEvent

  data!: any
}
