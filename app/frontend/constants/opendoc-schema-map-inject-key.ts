import { InjectionKey } from 'vue'
import { OpendocSchema } from '~/types/opendoc-schema'

export const OPENDOC_SCHEMA_MAP_INJECT_KEY = Symbol('OpendocSchemaMap') as InjectionKey<{ schemaMap: MaybeRef<Map<string, OpendocSchema>> }>
