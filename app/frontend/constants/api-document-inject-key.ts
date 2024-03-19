import { InjectionKey } from 'vue'
import { ApiDocument } from '~/api/backend/components/schemas'

export const API_DOCUMENT_INJECT_KEY = Symbol('ApiDocument') as InjectionKey<{ apiDocument: Ref<ApiDocument | null> }>
