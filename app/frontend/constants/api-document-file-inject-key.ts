import { InjectionKey } from 'vue'

export const API_DOCUMENT_FILE_INJECT_KEY = Symbol('') as InjectionKey<{ apiDocumentFile: MaybeRef<string | null> }>
