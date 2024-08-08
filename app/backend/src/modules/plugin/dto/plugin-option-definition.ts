import { PluginOption } from '../entities/plugin-option.entity'
import { TakeType } from '@miaooo/nestjs-take-type'


export class PluginOptionDefinition extends TakeType(
  PluginOption,
  ['key', 'format', 'value'],
  ['label', 'description'],
) {
}
