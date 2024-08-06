import { CompilerEvent } from '../constants/compiler-message-event'
import { SheetVersionBumpEventMessageDataDTO } from '../dto/sheet-version-bump-event-message-data.dto'
import { CreateSdkDTO } from '~/modules/sdk/dto/create-sdk.dto'
import { SdkCreatedEventMessageDataDTO } from '../dto/sdk-created-event-message-data.dto'
import { CompilerInformation } from '../dto/compiler-information.dto'
import { UpdateSdkDTO } from '~/modules/sdk/dto/update-sdk.dto'


export interface CompilerEventData {
  [CompilerEvent.COMPILER_JOIN]: never
  [CompilerEvent.COMPILER_INFORMATION]: CompilerInformation
  [CompilerEvent.SHEET_VERSION_BUMP]: Omit<SheetVersionBumpEventMessageDataDTO, 'compiler'>
  [CompilerEvent.SDK_CREATED]: Omit<SdkCreatedEventMessageDataDTO, 'compiler'>
  [CompilerEvent.TERMINATED]: never

  [CompilerEvent.CREATE_SDK]: CreateSdkDTO
  [CompilerEvent.UPDATE_SDK]: UpdateSdkDTO
}
