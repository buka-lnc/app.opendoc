import { InjectionKey } from 'vue'

export const ASYNCAPI_DOCUMENT_INJECT_KEY = Symbol('asyncapiDocument') as InjectionKey<Ref<any>>
