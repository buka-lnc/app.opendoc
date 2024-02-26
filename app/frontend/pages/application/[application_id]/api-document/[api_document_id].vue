<script setup lang="ts">
import { queryApiDocumentById, queryApiDocumentFile } from '~/api/backend'
import { ApiDocument } from '~/api/backend/components/schemas'
import { API_DOCUMENT_FILE_INJECT_KEY } from '~/constants/api-document-file-inject-key'
import { API_DOCUMENT_INJECT_KEY } from '~/constants/api-document-inject-key'

const route = useRoute()
const prefix = computed(() => `/application/${String(route.params.application_id)}/api-document/${String(route.params.api_document_id)}`)

const apiDocumentId = computed(() => String(route.params.api_document_id))
const apiDocumentFile = ref<string | null>(null)
const apiDocument = ref<ApiDocument | null>(null)

const { pending } = useAsyncData(
  async () => {
    const [apiDocumentRes, apiDocumentFileRes] = await Promise.all([
      queryApiDocumentById({
        apiDocumentId: apiDocumentId.value,
      }),

      queryApiDocumentFile({
        apiDocumentId: apiDocumentId.value,
      })
        .resolveWith('text'),
    ])

    apiDocument.value = apiDocumentRes
    apiDocumentFile.value = apiDocumentFileRes
  },
)

provide(API_DOCUMENT_INJECT_KEY, {
  apiDocument,
})

provide(API_DOCUMENT_FILE_INJECT_KEY, {
  apiDocumentFile,
})

const router = useRouter()
watch(
  () => apiDocument.value,
  async () => {
    if (!apiDocument.value) return

    if (route.path === prefix.value) {
      if (apiDocument.value.type === 'markdown') {
        await router.replace(`${prefix.value}/markdown`)
      } else if (apiDocument.value.type === 'openapi') {
        await router.replace(`${prefix.value}/openapi/ui/operation`)
      }
    }
  },
)
</script>

<template>
  <div class="size-full">
    <nuxt-page
      v-if="apiDocumentFile && apiDocument && !pending"
    />
  </div>
</template>

<style scoped lang="postcss">
</style>
