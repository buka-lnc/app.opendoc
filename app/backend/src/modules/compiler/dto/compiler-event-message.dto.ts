import { IsEnum } from 'class-validator'
import { CompilerEvent } from '../constants/compiler-message-event'

export class CompilerEventMessageDTO {
  @IsEnum(CompilerEvent)
  event!: CompilerEvent

  data!: any
}
