import { PickType } from '@nestjs/swagger'
import { PluginOption } from '../entities/plugin-option.entity'

export class UpdatePluginOptionDTO extends PickType(PluginOption, ['key', 'value']) {
}
