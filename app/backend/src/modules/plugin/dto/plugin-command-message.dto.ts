import { IsEnum } from 'class-validator'
import { PluginCommandName } from '../constants/plugin-command-name'

export class PluginCommandMessage {
  @IsEnum(PluginCommandName)
  command!: PluginCommandName

  data!: any
}
