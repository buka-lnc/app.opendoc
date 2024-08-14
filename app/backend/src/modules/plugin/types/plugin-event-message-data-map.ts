import { PluginEventName } from '../constants/plugin-event-name'
import { BasePluginEventMessageData } from '../dto/plugin-event-message/base-plugin-event-message-data.dto'
import { SdkCreatedPluginEventMessageData } from '../dto/plugin-event-message/sdk-created-plugin-event-message-data.dto'
import { SdkDeletedPluginEventMessageData } from '../dto/plugin-event-message/sdk-deleted-plugin-event-message-data.dto'
import { SdkUpdatedPluginEventMessageData } from '../dto/plugin-event-message/sdk-updated-plugin-event-message-data.dto'
import { SheetCreatedPluginEventMessageData } from '../dto/plugin-event-message/sheet-created-plugin-event-message-data.dto'
import { SheetDeletedPluginEventMessageData } from '../dto/plugin-event-message/sheet-deleted-plugin-event-message-data.dto'
import { SheetVersionBumpPluginEventMessageData } from '../dto/plugin-event-message/sheet-version-bump-plugin-event-message-data.dto'


export interface PluginEventMessageDataMap extends Record<PluginEventName, BasePluginEventMessageData> {
  [PluginEventName.SHEET_CREATED]: SheetCreatedPluginEventMessageData
  [PluginEventName.SHEET_DELETED]: SheetDeletedPluginEventMessageData

  [PluginEventName.SHEET_VERSION_BUMP]: SheetVersionBumpPluginEventMessageData

  [PluginEventName.SDK_CREATED]: SdkCreatedPluginEventMessageData
  [PluginEventName.SDK_UPDATED]: SdkUpdatedPluginEventMessageData
  [PluginEventName.SDK_DELETED]: SdkDeletedPluginEventMessageData

  [PluginEventName.API_FILE_CREATED]: BasePluginEventMessageData
  [PluginEventName.API_FILE_UPDATED]: BasePluginEventMessageData
  [PluginEventName.API_FILE_DELETED]: BasePluginEventMessageData

  [PluginEventName.TERMINATED]: BasePluginEventMessageData
}
