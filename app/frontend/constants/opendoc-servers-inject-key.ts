import { OpenAPIV3 } from 'openapi-types'
import { InjectionKey } from 'vue'

export const OPENDOC_SERVERS_INJECT_KEY = Symbol('OpendocServers') as InjectionKey<{ servers: Ref<OpenAPIV3.ServerObject[]> }>
