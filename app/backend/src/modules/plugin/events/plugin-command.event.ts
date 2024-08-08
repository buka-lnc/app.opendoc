import { PluginCommandName } from '../constants/plugin-command-name'
import { PluginCommandMessageDataMap } from '../types/plugin-command-message-data-map'


export class PluginCommandEvent<T extends PluginCommandName> {
  constructor(
    public readonly pluginId: string,
    public readonly event: T,
    public readonly data: PluginCommandMessageDataMap[T]
  ) {}
}
