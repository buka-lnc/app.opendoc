import { InjectionKey } from 'vue'
import { Folder } from '~/api/backend/components/schemas'

export const FOLDERS_INJECT_KEY = Symbol('folders') as InjectionKey<{ folders: MaybeRef<Folder[] | null>; reloadFolders: () => Promise<any> }>
