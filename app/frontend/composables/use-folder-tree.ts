import * as R from 'ramda'
import { Folder } from '~/api/backend/components/schemas'
import { TreeFolder } from '~/types/tree-folder'

export function useFolderTree (maybeRefOrGetterFolders: MaybeRefOrGetter<Folder[]>): Ref<TreeFolder[]> {
  const folders = toRef(maybeRefOrGetterFolders)

  const tree = computed(() => {
    if (!folders.value.length) return []

    const treeFolders = folders.value.map((f): TreeFolder => ({ ...f, children: [] }))
    const groupedFolders = R.groupBy(R.prop('mpath'), treeFolders)

    const foldersWithChildren: TreeFolder[] = []

    for (const [mpath, children] of Object.entries(groupedFolders)) {
      const parentMpath = mpath
        .split('/')
        .slice(0, -2)
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
