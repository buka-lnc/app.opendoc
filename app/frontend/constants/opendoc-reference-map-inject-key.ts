import { InjectionKey } from 'vue'
import { OpendocReference } from '~/types/opendoc-reference'

export const OPENDOC_REFERENCE_MAP_INJECT_KEY = Symbol('OpendocReferenceMap') as InjectionKey<{ referenceMap: MaybeRef<Map<string, OpendocReference>> }>
