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

const apiDocumentFile = ref<string | null>(null)

const { pending: isLoadingApiDocumentFile } = useAsyncData(
  async () => {
    apiDocumentFile.value = null

    const res = await queryApiDocumentFile({
      documentId: apiDocumentId.value,
    }).option('resolveWithFullResponse')

    apiDocumentFile.value = await res.text()
  },
)

const monacoOptions: monaco.editor.IEditorConstructionOptions = {
  // readOnly: true,
  automaticLayout: true,
  scrollBeyondLastLine: false,
}
</script>
<template>
  <nuxt-loading-indicator v-if="isLoadingApiDocument || isLoadingApiDocumentFile" />

  <div v-if="apiDocumentFile && apiDocument && !isLoadingApiDocument" class="h-full bg-base-300">
    <div
      v-if="apiDocument.type === 'readme'"
      class="h-full overflow-y-auto"
    >
      <markdown
        :content="apiDocumentFile"
      />
    </div>

    <Suspense>
      <lazy-openapi-monaco-editor
        v-if="apiDocument.type === 'openapi'"
        class="h-full"
        :modal-value="apiDocumentFile"
        theme="vs"
        lang="json"
        :options="monacoOptions"
      />

      <template #fallback>
        <div class="h-full w-full grid place-content-center bg-base-300">
          <span class="d-loading d-loading-ring d-loading-lg" />
        </div>
      </template>
    </Suspense>
  </div>
</template>
