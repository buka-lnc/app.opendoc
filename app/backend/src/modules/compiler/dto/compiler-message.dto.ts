import { IsEnum, IsString } from 'class-validator'
import { CompilerMessageEvent } from '../constants/compiler-message-event'

export class CompilerMessageDTO {
  @IsString()
  id!: string

  @IsEnum(CompilerMessageEvent)
  event!: CompilerMessageEvent

  data!: any
}
