type PromiseFunction = (...args: any[]) => Promise<any>

interface UseAsyncFnReturnType<T extends PromiseFunction> {
  pending: Ref<boolean>
  error: Ref<Error | null>
  execute: T
}

export function useAsyncFn<T extends PromiseFunction>(fn: T): UseAsyncFnReturnType<T> {
  const pending = ref(false)
  const error = ref<Error | null>(null)

  async function execute(...args: Parameters<T>): Promise<void> {
    pending.value = true
    error.value = null

    try {
      return await fn(...args)
    }
    catch (err) {
      error.value = err as Error
    }
    finally {
      pending.value = false
    }
  }

  return {
    pending,
    error,
    execute: execute as T,
  }
}
