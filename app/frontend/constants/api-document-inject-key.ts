import { InjectionKey } from 'vue'
import { ApiDocument } from '~/api/backend/components/schemas'

export const API_DOCUMENT_INJECT_KEY = Symbol('') as InjectionKey<{ apiDocument: MaybeRef<ApiDocument | null> }>
