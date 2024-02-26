import { InjectionKey } from 'vue'
import { OpendocOperation } from '~/types/opendoc-operation'

export const OPENDOC_OPERATIONS_INJECT_KEY = Symbol('') as InjectionKey<{ operations: MaybeRef<OpendocOperation[]> }>
