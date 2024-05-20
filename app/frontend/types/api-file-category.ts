import { ApiFile } from '~/api/backend/components/schemas'

export interface ApiFileCategory {
  $dir: string
  $name: string
  $path: string
  $children: (ApiFileCategory | (ApiFile & ApiFileCategory))[]
}
