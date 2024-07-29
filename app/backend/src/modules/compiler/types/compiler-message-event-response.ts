import { CompilerMessageEvent } from '../constants/compiler-message-event'
import { CompilerInfoDTO } from '../dto/compiler-info.dto'


export interface CompilerMessageEventResponse {
  [CompilerMessageEvent.INFO]: CompilerInfoDTO
  [CompilerMessageEvent.COMPILE]: never
  [CompilerMessageEvent.FILTER]: never
  [CompilerMessageEvent.ICON]: never
}
