import { InjectionKey } from 'vue'
import { OpendocOperation } from '~/types/opendoc-operation'

export const OPENDOC_OPERATIONS_INJECT_KEY = Symbol('OpendocOperations') as InjectionKey<{ operations: MaybeRef<OpendocOperation[]> }>
