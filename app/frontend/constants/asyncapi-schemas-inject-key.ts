import { InjectionKey } from 'vue'
import { AsyncapiSchema } from '~/types/asyncapi-schema'

export const ASYNCAPI_SCHEMAS_INJECT_KEY = Symbol('asyncapiSchema') as InjectionKey<Ref<AsyncapiSchema[]>>
