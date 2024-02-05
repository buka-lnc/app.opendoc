<script setup lang="ts">
import { queryApiDocumentById } from '~/api/backend'

const route = useRoute()
const apiDocumentId = computed(() => String(route.params.api_document_id))

const { data: apiDocument, pending: isLoadingApiDocument } = useAsyncData(
  async () => {
    const apiDocument = await queryApiDocumentById({
      documentId: apiDocumentId.value,
    })
    return apiDocument
  },
)
</script>
<template>
  <nuxt-loading-indicator v-if="isLoadingApiDocument" />

  <div v-if="apiDocument && !isLoadingApiDocument" class="h-full bg-base-100 relative">
    <NuxtPage />

    <openapi-view-switch
      v-if="apiDocument.type === 'openapi'"
      class="absolute top-4 left-4"
      :folder-id="String($route.params.folder_id)"
      :api-document-id="String($route.params.api_document_id)"
    />
  </div>
</template>
