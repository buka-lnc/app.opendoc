import { Sheet } from '~/api/backend/components/schemas'

export const SheetModeDescription: Record<Sheet['mode'], string> = {
  pull: 'Pull',
  push: 'Push',
}
