import { InjectionKey } from 'vue'
import { OpenapiOperation } from '~/types/openapi-operation'

export const OPENAPI_OPERATIONS_INJECT_KEY = Symbol('openapiOperations') as InjectionKey<Ref<OpenapiOperation[]>>
