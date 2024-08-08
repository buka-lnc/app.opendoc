import { PluginEventName } from '../constants/plugin-event-name'
import { BasePluginEventMessageData } from '../dto/plugin-event-message/base-plugin-event-message-data.dto'
import { SdkCreatedPluginEventMessageData } from '../dto/plugin-event-message/sdk-created-plugin-event-message-data.dto'
import { SheetVersionBumpPluginEventMessageData } from '../dto/plugin-event-message/sheet-version-bump-plugin-event-message-data.dto'


export interface PluginEventMessageDataMap extends Record<PluginEventName, BasePluginEventMessageData> {
  [PluginEventName.SHEET_VERSION_BUMP]: SheetVersionBumpPluginEventMessageData
  [PluginEventName.SDK_CREATED]: SdkCreatedPluginEventMessageData
  [PluginEventName.TERMINATED]: BasePluginEventMessageData
}
