import { InjectionKey } from 'vue'

export const SELECT_VISIBLE_INJECT_KEY = Symbol('SELECT_VISIBLE_INJECT_KEY') as InjectionKey<{
  visible: Ref<boolean>
  toggleVisible: (visible?: boolean) => void
}>
