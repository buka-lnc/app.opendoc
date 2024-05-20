import { useDereferenceFn } from './use-dereference-fn'

/**
 * 将 $ref 属性解析为实际的引用值
 */
export function useDereference<T> (o: MaybeRefOrGetter<Object | undefined>): [Ref<T | undefined>, Ref<string[]>] {
  const re = computed(() => toValue(o))

  const dereference = useDereferenceFn()

  const target = ref<T>()
  const paths = ref<string[]>([])

  watchEffect(() => {
    const v = re.value
    const [t, p] = dereference<T>(v)

    target.value = t
    paths.value = p
  })

  return [target, paths]
}
