import { EntityDTO, Loaded } from '@mikro-orm/core'
import { PluginCommandName } from '../constants/plugin-command-name'
import { PluginCommandMessageDataMap } from '../types/plugin-command-message-data-map'
import { Plugin } from '../entities/plugin.entity'


export class PluginCommandEvent<T extends PluginCommandName> {
  constructor(
    public readonly plugin: EntityDTO<Loaded<Plugin>>,
    public readonly event: T,
    public readonly data: PluginCommandMessageDataMap[T]
  ) {}
}
