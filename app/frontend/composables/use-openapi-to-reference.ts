import { useRouteParams } from '@vueuse/router'

export function useOpenapiToReference (): ((referenceId: string) => string) {
  const applicationId = useRouteParams<string>('application_id')
  const apiDocumentId = useRouteParams<string>('api_document_id')
  const version = useRouteParams<string>('version')

  return function toReference (referenceId: string): string {
    return `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/openapi/ui/schema/${referenceId}`
  }
}
