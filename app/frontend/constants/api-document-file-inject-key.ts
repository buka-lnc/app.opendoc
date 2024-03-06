import { InjectionKey } from 'vue'

export const API_DOCUMENT_FILE_INJECT_KEY = Symbol('ApiDocumentFile') as InjectionKey<{ apiDocumentFile: MaybeRef<string | null> }>
