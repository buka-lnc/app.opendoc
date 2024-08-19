import { IsString } from 'class-validator'


export class PluginLogs {
  @IsString()
  message!: string
}
