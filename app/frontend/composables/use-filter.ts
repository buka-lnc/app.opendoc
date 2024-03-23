import * as R from 'ramda'


interface UseFilterReturnType<T> {
  filter: Ref<string>
  data: ComputedRef<T[]>
}

export function useFilter<T>(arr: Ref<T[]>, format: (item: T) => string): UseFilterReturnType<T> {
  const filter = ref('')

  const filteredSchema = computed(() => {
    const results = toValue(arr)
    if (!filter) return results
    const target = filter.value.toLowerCase()

    const filtered = results
      .filter((item) => format(item).toLowerCase().includes(target))

    return R.sortBy(item => format(item).toLowerCase().indexOf(target), filtered)
  })

  return {
    filter,
    data: filteredSchema,
  }
}
