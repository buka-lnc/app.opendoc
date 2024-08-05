import { CompilerEvent } from '../constants/compiler-message-event'
import { CompilerJoinAckEventDataDTO } from '../dto/compiler-join-ack-event-data.dto'
import { Sdk } from '~/modules/sdk/entities/sdk.entity'
import { SheetVersionBumpEventMessageDataDTO } from '../dto/sheet-version-bump-event-message-data.dto'
import { CreateSdkDTO } from '~/modules/sdk/dto/create-sdk.dto'


export interface CompilerEventData {
  [CompilerEvent.COMPILER_JOIN]: never
  [CompilerEvent.COMPILER_JOIN_ACK]: CompilerJoinAckEventDataDTO
  [CompilerEvent.SHEET_VERSION_BUMP]: Omit<SheetVersionBumpEventMessageDataDTO, 'compiler'>
  [CompilerEvent.SDK_CREATED]: Sdk
  [CompilerEvent.TERMINATED]: never

  [CompilerEvent.CREATE_SDK]: CreateSdkDTO
  [CompilerEvent.UPDATE_SDK]: never
}
