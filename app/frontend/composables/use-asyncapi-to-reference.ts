import { useRouteParams } from '@vueuse/router'

export function useAsyncapiToReference (): ((referenceId: string) => string) {
  const applicationId = useRouteParams<string>('application_id')
  const apiDocumentId = useRouteParams<string>('api_document_id')
  const version = useRouteParams<string>('version')

  return function toReference (referenceId: string): string {
    return `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/asyncapi/ui/schema/${referenceId}`
  }
}
