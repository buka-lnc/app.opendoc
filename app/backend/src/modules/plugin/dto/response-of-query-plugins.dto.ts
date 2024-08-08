import { ResponseOfType } from '~/type-helpers/response-of'
import { Plugin } from '../entities/plugin.entity'

export class ResponseOfQueryPluginsDTO extends ResponseOfType(Plugin) {
}
