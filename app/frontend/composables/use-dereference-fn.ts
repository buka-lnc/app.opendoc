import * as R from 'ramda'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key'

export function useDereferenceFn (): (<T>(v: Object | undefined) => [T | undefined, string[]]) {
  const schema = inject(SCHEMA_INJECT_KEY)

  return function dereference<T> (v: Object | undefined): [T | undefined, string[]] {
    const paths: string[] = []

    const s = toValue(schema)

    if (!v || !('$ref' in v) || typeof v.$ref !== 'string') {
      return [v as T, paths]
    }

    let $ref = v.$ref

    while ($ref) {
      paths.push($ref)
      if (!$ref.startsWith('#')) break

      const result = R.path($ref.split('/').slice(1), s) as any
      if (!result || !('$ref' in result) || typeof result.$ref !== 'string') {
        return [result as (T | undefined), paths]
      }

      // Circular reference detected
      if (paths.includes(result.$ref)) {
        return [result, paths]
      }

      $ref = result.$ref
    }

    return [undefined, paths]
  }
}
