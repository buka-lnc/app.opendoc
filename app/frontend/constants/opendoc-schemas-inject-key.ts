import { InjectionKey } from 'vue'
import { OpendocSchema } from '~/types/opendoc-schema'

export const OPENDOC_SCHEMAS_INJECT_KEY = Symbol('OpendocSchemas') as InjectionKey<{ schemas: MaybeRef<OpendocSchema[]> }>
