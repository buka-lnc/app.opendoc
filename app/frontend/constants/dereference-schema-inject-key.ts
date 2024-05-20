import { InjectionKey } from 'vue'

export const DEREFERENCE_SCHEMA_INJECT_KEY = Symbol('dereferenceSchema') as InjectionKey<Ref<any>>
