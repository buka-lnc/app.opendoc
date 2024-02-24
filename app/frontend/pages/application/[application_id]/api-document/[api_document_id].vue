<script setup lang="ts">
import { queryApiDocumentById, queryApiDocumentFile } from '~/api/backend'
import { ApiDocument } from '~/api/backend/components/schemas'

const route = useRoute()

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
// route.params
</script>

<template>
  <div class="size-full">
    <!-- code -->
    <template v-if="apiDocumentFile && apiDocument && !pending">
      <markdown
        v-if="apiDocument.type === 'markdown'"
        class="w-full mx-auto"
        :content="apiDocumentFile"
      />
    </template>
  </div>
</template>

<style scoped lang="postcss">
</style>
