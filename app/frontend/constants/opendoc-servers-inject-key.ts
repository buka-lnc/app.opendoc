import { OpenAPIV3 } from 'openapi-types'
import { InjectionKey } from 'vue'

export const OPENDOC_SERVERS_INJECT_KEY = Symbol('') as InjectionKey<{ servers: MaybeRef<OpenAPIV3.ServerObject[]> }>
