import { CompilerEvent } from '../constants/compiler-message-event'

export interface WebSocketFetchOptions<T extends CompilerEvent> {
  event: T
  data?: any
}
