import { RemovableRef } from '@vueuse/core'

export function useTheme (): RemovableRef<'light' | 'dark'> {
  return useLocalStorage<'light' | 'dark'>('theme', 'dark')
}
