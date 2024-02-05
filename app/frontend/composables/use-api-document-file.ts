import { queryApiDocumentFile } from '~/api/backend'

interface UseApiDocumentFileReturnType {
  apiDocumentFile: Ref<string>
  isLoadingApiDocumentFile: Ref<boolean>
}

export function useApiDocumentFile (apiDocumentId: MaybeRefOrGetter<string>): UseApiDocumentFileReturnType {
  const apiDocumentFile = ref<string | null>(null)
  const { pending: isLoadingApiDocumentFile } = useAsyncData(async () => {
    apiDocumentFile.value = null

    const res = await queryApiDocumentFile({
      documentId: toValue(apiDocumentId),
    }).option('resolveWithFullResponse')

    apiDocumentFile.value = await res.text()
  })

  return {
    isLoadingApiDocumentFile,
    apiDocumentFile,
  }
}
