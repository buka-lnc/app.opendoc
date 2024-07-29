import { CompilerMessageEvent } from '../constants/compiler-message-event'

export interface WebSocketFetchOptions<T extends CompilerMessageEvent> {
  event: T

  data?: any

  // ms
  ttl?: number
}
