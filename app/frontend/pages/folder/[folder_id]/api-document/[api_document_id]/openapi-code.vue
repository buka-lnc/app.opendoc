<script setup lang="ts">
import type * as monaco from 'monaco-editor'

const route = useRoute()
const apiDocumentId = computed(() => String(route.params.api_document_id))
const { isLoadingApiDocumentFile, apiDocumentFile } = useApiDocumentFile(apiDocumentId)

const monacoOptions: monaco.editor.IEditorConstructionOptions = {
  readOnly: true,
  automaticLayout: true,
  scrollBeyondLastLine: false,
}
</script>
<template>
  <stuffed-loading :pending="isLoadingApiDocumentFile">
    <Suspense>
      <lazy-openapi-monaco-editor
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
  </stuffed-loading>
</template>
