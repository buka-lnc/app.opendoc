import { PickType } from '@nestjs/swagger'
import { Plugin } from '../entities/plugin.entity'


export class CreatePluginDTO extends PickType(Plugin, ['url']) {
}
