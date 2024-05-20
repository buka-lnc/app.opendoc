import * as R from 'ramda'
import { ApiFile } from '~/api/backend/components/schemas'
import { ApiFileCategory } from '~/types/api-file-category'

export function toApiFileCategories (apiFilesRef: MaybeRef<ApiFile[]>): Ref<ApiFileCategory[]> {
  const apiFileCategories = computed(() => {
    const apiFiles = toValue(apiFilesRef)

    const mapping: Map<string, ApiFileCategory[]> = new Map()

    const dirs = R.uniq(R.unnest(
      apiFiles
        .map((apiFile) => {
          const path = apiFile.path.split('/')
          const dir = R.dropLast(1, path)
          const dirs = dir.reduce(
            (acc: string[], _: string, index: number, arr: string[]) => [...acc, R.take(index + 1, arr).join('/')],
            [],
          )

          return dirs
        }),
    ))
      .map((dir): ApiFileCategory => {
        const path = dir.split('/')

        return {
          $dir: R.dropLast(1, path).join('/'),
          $name: R.last(path) || '',
          $path: dir,
          $children: [],
        }
      })

    for (const dir of dirs) {
      if (!mapping.has(dir.$dir)) mapping.set(dir.$dir, [])
      mapping.get(dir.$dir)?.push(dir)
    }

    const apiFileCategories = apiFiles
      .map((apiFile) => {
        const path = apiFile.path.split('/')
        const dir = R.dropLast(1, path)
        const name = R.last(path) || ''

        const category: ApiFileCategory & ApiFile = {
          ...apiFile,
          $dir: dir.join('/'),
          $name: name,
          $path: apiFile.path,
          $children: [],
        }

        return category
      })

    for (const category of apiFileCategories) {
      if (!mapping.has(category.$dir)) mapping.set(category.$dir, [])
      mapping.get(category.$dir)?.push(category)
    }

    for (const dir of dirs) {
      const children = mapping.get(dir.$path) || []
      dir.$children = R.sortBy(R.prop('$name'), children)
    }

    return mapping.get('') || []
  })

  return apiFileCategories
}
