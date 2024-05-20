import { InjectionKey } from 'vue'
import { Application, Sheet } from '~/api/backend/components/schemas'

export const APPLICATION_INJECT_KEY = Symbol('Application') as InjectionKey<{
  application: Ref<Application | null>
  sheets: Ref<Sheet[]>
}>
