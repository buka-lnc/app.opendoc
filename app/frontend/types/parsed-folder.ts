import { Folder } from '~/api/backend/components/schemas'

export interface ParsedFolder extends Folder {
  mpaths: string[]
}
