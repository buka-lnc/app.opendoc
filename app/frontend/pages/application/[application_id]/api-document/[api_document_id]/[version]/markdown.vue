<script setup lang="ts">
import { inject } from 'vue'
import { API_DOCUMENT_FILE_INJECT_KEY } from '~/constants/api-document-file-inject-key'
import { API_DOCUMENT_INJECT_KEY } from '~/constants/api-document-inject-key'

const { apiDocument } = inject(API_DOCUMENT_INJECT_KEY, { apiDocument: null })
const { apiDocumentFile } = inject(API_DOCUMENT_FILE_INJECT_KEY, { apiDocumentFile: null })

</script>

<template>
  <div
    v-if="apiDocument && apiDocumentFile"
    class="size-full overflow-x-hidden overflow-y-auto"
  >
    <markdown-view
      v-if="apiDocument.type === 'markdown'"
      class="w-full mx-auto py-6"
      :content="apiDocumentFile"
    />
  </div>
</template>

<style scoped lang="postcss">
</style>
