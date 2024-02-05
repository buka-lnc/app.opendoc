import * as R from 'ramda'
import { Folder } from '~/api/backend/components/schemas'
import { ParsedFolder } from '~/types/parsed-folder'

export function useFolderTree (maybeRefOrGetterFolders: MaybeRefOrGetter<Folder[]>): Ref<ParsedFolder[]> {
  const folders = toRef(maybeRefOrGetterFolders)

  const tree = computed(() => {
    if (!folders.value.length) return []

    const treeFolders = folders.value.map((f): ParsedFolder => ({
      ...f,
      mpaths: f.mpath.slice(0, -1).split('/'),
      children: [],
    }))

    const groupedFolders = R.groupBy(R.prop('mpath'), treeFolders)

    const foldersWithChildren: ParsedFolder[] = []

    for (const [mpath, children] of Object.entries(groupedFolders)) {
      const mpaths = mpath.slice(0, -1).split('/')
      const parentMpath = mpaths
        .slice(0, -1)
        .join('/')
        .concat('/')

      if (!children) continue

      const parent = treeFolders.find(f => f.mpath === parentMpath)
      if (!parent) {
        foldersWithChildren.push(...children)
        continue
      }

      parent.children.push(...children)
    }

    return foldersWithChildren
  })

  return tree
}
