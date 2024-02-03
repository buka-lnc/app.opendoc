<script setup lang="ts">
import type * as monaco from 'monaco-editor'
import { queryApiDocumentById, queryApiDocumentFile } from '~/api/backend'

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

const { data: apiDocumentFile, pending: isLoadingApiDocumentFile } = useAsyncData(
  async () => {
    const res = await queryApiDocumentFile({
      documentId: apiDocumentId.value,
    }).option('resolveWithFullResponse')

    return res.text()
  },
)

const monacoOptions: monaco.editor.IEditorConstructionOptions = {
  readOnly: true,
  automaticLayout: true,
}
</script>
<template>
  <nuxt-loading-indicator v-if="isLoadingApiDocument || isLoadingApiDocumentFile" />

  <div v-if="apiDocumentFile && apiDocument" class="h-full">
    <div
      v-if="apiDocument.type === 'readme'"
      class="h-full overflow-y-auto"
    >
      <markdown
        :content="apiDocumentFile"
      />
    </div>

    <lazy-monaco-editor
      v-if="apiDocument.type === 'openapi'"
      class="h-full"
      theme="vs"
      :model-value="JSON.stringify(JSON.parse(apiDocumentFile), null, 2) "
      lang="json"
      :options="monacoOptions"
    />
  </div>
</template>
