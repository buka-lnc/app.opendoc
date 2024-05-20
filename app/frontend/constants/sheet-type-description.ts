import { Sheet } from '~/api/backend/components/schemas'

export const SheetTypeDescription: Record<Sheet['type'], string> = {
  openapi: 'OpenAPI',
  asyncapi: 'AsyncAPI',
  markdown: 'Markdown',
}
