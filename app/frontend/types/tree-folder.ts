import { Folder } from '~/api/backend/components/schemas'

export interface TreeFolder extends Folder {
  children: TreeFolder[]
}
