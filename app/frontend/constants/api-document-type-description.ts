import { ApiDocument } from '~/api/backend/components/schemas'

export const ApiDocumentTypeDescription: Record<ApiDocument['type'], string> = {
  openapi: 'OpenAPI',
  asyncapi: 'AsyncAPI',
  markdown: 'Markdown',
}
