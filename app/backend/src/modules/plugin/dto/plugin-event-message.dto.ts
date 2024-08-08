import { IsEnum } from 'class-validator'
import { PluginEventName } from '../constants/plugin-event-name'

export class PluginEventMessage {
  @IsEnum(PluginEventName)
  event!: PluginEventName

  data!: any
}
