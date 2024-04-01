import { ApiDocument } from '~/api/backend/components/schemas'

export const ApiDocumentModeDescription: Record<ApiDocument['mode'], string> = {
  pull: 'Pull',
  push: 'Push',
}
