import { InjectionKey } from 'vue'

/**
 * OpenAPI或AsyncAPI 文档对象
 * 主要用于dereference
 */
export const SCHEMA_INJECT_KEY = Symbol('Schema') as InjectionKey<Ref<Object>>
