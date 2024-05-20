import { InjectionKey } from 'vue'
import { Sheet } from '~/api/backend/components/schemas'

export const SHEET_INJECT_KEY = Symbol('Sheet') as InjectionKey<Ref<Sheet | null>>
