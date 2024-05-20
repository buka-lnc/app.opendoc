import { InjectionKey } from 'vue'
import { OpenapiSchema } from '~/types/openapi-schema'

export const OPENAPI_SCHEMAS_INJECT_KEY = Symbol('openapiSchemas') as InjectionKey<Ref<OpenapiSchema[]>>
