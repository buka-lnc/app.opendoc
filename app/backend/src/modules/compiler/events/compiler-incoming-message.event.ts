import { CompilerEvent } from '../constants/compiler-message-event'
import { CompilerEventData } from '../types/compiler-event-data'

export class CompilerIncomingMessageEvent<E extends CompilerEvent> {
  constructor(
    public readonly compilerId: string,
    public readonly event: E,
    public readonly data: CompilerEventData[E]
  ) {}
}
