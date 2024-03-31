interface UseAsyncFnReturnType<T extends (...args: any[]) => Promise<any>> {
  pending: Ref<boolean>
  error: Ref<Error | null>
  execute: T
}

export function useAsyncFn<T extends (...args: any[]) => Promise<any>> (fn: T): UseAsyncFnReturnType<T> {
  const pending = ref(false)
  const error = ref<Error | null>(null)

  async function execute (...args: Parameters<T>) {
    pending.value = true
    error.value = null

    try {
      return await fn(...args)
    } catch (err) {
      error.value = err as Error
    } finally {
      pending.value = false
    }
  }

  return {
    pending,
    error,
    execute: execute as T,
  }
}
