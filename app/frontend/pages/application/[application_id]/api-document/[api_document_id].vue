<script setup lang="ts">
import { queryApiDocumentById, queryApiDocumentFilesByApiDocumentId } from '~/api/backend'
import { ApiDocument, ApiDocumentFile } from '~/api/backend/components/schemas'
import { API_DOCUMENT_INJECT_KEY } from '~/constants/api-document-inject-key'

const route = useRoute()
const prefix = computed(() => `/application/${String(route.params.application_id)}/api-document/${String(route.params.api_document_id)}`)

const apiDocumentId = computed(() => String(route.params.api_document_id))
const apiDocument = ref<ApiDocument | null>(null)

const apiDocumentFiles = ref<ApiDocumentFile[]>([])

const { pending } = useAsyncData(
  async () => {
    const [apiDocumentRes, apiDocumentFilesRes] = await Promise.all([
      queryApiDocumentById<200>({
        apiDocumentId: apiDocumentId.value,
      }),

      queryApiDocumentFilesByApiDocumentId<200>({
        apiDocumentId: apiDocumentId.value,
      }),
    ])

    apiDocument.value = apiDocumentRes
    apiDocumentFiles.value = apiDocumentFilesRes
  },
)

provide(API_DOCUMENT_INJECT_KEY, {
  apiDocument,
})

const router = useRouter()
watch(
  () => apiDocument.value,
  async () => {
    if (!apiDocument.value) return

    if (route.path === prefix.value) {
      if (!apiDocumentFiles.value.length) return
      const version = apiDocumentFiles.value[0].version

      if (apiDocument.value.type === 'markdown') {
        await router.replace(`${prefix.value}/${version}/markdown`)
      } else if (apiDocument.value.type === 'openapi') {
        await router.replace(`${prefix.value}/${version}/openapi/ui/operation`)
      }
    }
  },
)
</script>

<template>
  <div class="size-full">
    <nuxt-page v-if="apiDocument && !pending" />
  </div>
</template>

<style scoped lang="postcss">
</style>
