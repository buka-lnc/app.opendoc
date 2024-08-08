import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { Plugin } from '../../entities/plugin.entity'


export class BasePluginEventMessageData {
  @ValidateNested()
  @Type(() => Plugin)
  plugin!: Plugin
}
