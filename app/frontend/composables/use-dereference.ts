import * as R from 'ramda'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key'

export function useDereference<T> (o: MaybeRefOrGetter<Object | undefined>): [Ref<T | undefined>, Ref<string[]>] {
  const schema = inject(SCHEMA_INJECT_KEY)
  const re = computed(() => toValue(o))

  const target = ref<T>()
  const paths = ref<string[]>([])

  watchEffect(() => {

  })

  watchEffect(() => {
    target.value = undefined
    paths.value = []

    const v = re.value
    const s = toValue(schema)

    if (!v || !('$ref' in v) || typeof v.$ref !== 'string') {
      target.value = v as T
      return
    }

    let $ref = v.$ref

    while ($ref) {
      paths.value.push($ref)
      if (!$ref.startsWith('#')) break

      const result = R.path($ref.split('/').slice(1), s) as any
      if (!result || !('$ref' in result) || typeof result.$ref !== 'string') {
        target.value = result as (T | undefined)
        break
      }

      $ref = result.$ref
    }
  })

  return [target, paths]
}
