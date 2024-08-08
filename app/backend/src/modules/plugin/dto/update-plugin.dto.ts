import { TakeType } from '@miaooo/nestjs-take-type'
import { UpdatePluginOptionDTO } from './update-plugin-option.dto'
import { Plugin } from '../entities/plugin.entity'

export class UpdatePluginDTO extends TakeType(
  Plugin,
  [],
  ['status']
) {
  options?: UpdatePluginOptionDTO[]
}
