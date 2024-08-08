import { PluginEventName } from '../constants/plugin-event-name'

export interface WebSocketFetchOptions<T extends PluginEventName> {
  event: T
  data?: any
}
