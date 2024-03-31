import { nanoid } from 'nanoid'

interface AlertMessage {
  id: string
  type: 'error' | 'success'
  message: string
  ttl: number
}

export const useAlertState = createGlobalState(
  () => {
    const messages = ref<AlertMessage[]>([])

    return { messages }
  },
)

export interface UseAlertReturnType {
  error: (message: string, ttl?: number) => void
  success: (message: string, ttl?: number) => void
}

export function useAlert (): UseAlertReturnType {
  const { messages } = useAlertState()

  function error (message: string, ttl: number = 5000) {
    const id = nanoid()
    messages.value.push({ id, type: 'error', message, ttl })

    setTimeout(() => {
      messages.value = messages.value.filter(msg => msg.id !== id)
    }, ttl)
  }

  function success (message: string, ttl: number = 5000) {
    const id = nanoid()
    messages.value.push({ id, type: 'success', message, ttl })

    setTimeout(() => {
      messages.value = messages.value.filter(msg => msg.id !== id)
    }, ttl)
  }

  return {
    error,
    success,
  }
}
