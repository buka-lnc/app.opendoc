import { CompilerMessageEvent } from '../constants/compiler-message-event'
import { CompileEventResponseDataDTO } from '../dto/compile-event-response-data.dto'
import { IntroduceEventResponseDataDTO } from '../dto/introduce-event-response-data.dto'


export interface CompilerMessageEventResponse {
  [CompilerMessageEvent.INTRODUCE]: IntroduceEventResponseDataDTO
  [CompilerMessageEvent.COMPILE]: CompileEventResponseDataDTO
  [CompilerMessageEvent.ICON]: never
  [CompilerMessageEvent.UPDATE_SDK]: never
}
