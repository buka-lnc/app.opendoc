import { CreateSdkDTO } from '~/modules/sdk/dto/create-sdk.dto'
import { PluginCommandName } from '../constants/plugin-command-name'
import { PluginMetadata } from '../dto/plugin-command-message/plugin-metadata.dto'
import { UpdateSdkDTO } from '~/modules/sdk/dto/update-sdk.dto'

export interface PluginCommandMessageDataMap {
  [PluginCommandName.JOIN]: PluginMetadata
  [PluginCommandName.CREATE_SDK]: CreateSdkDTO
  [PluginCommandName.UPDATE_SDK]: UpdateSdkDTO
}
