import { OpenAPIV3 } from 'openapi-types'
import { InjectionKey } from 'vue'

export const OPENAPI_DOCUMENT_INJECT_KEY = Symbol('openapiDocument') as InjectionKey<Ref<OpenAPIV3.Document>>
