import { useRouteParams } from '@vueuse/router'

export function useOpenapiToReference (): ((referenceId: string) => string) {
  const applicationId = useRouteParams<string>('application_id')
  const sheetId = useRouteParams<string>('sheet_id')
  const version = useRouteParams<string>('version')

  return function toReference (referenceId: string): string {
    return `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/openapi/schema/${referenceId}`
  }
}
