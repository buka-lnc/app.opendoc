<script setup lang="ts">
import { inject } from 'vue'
import { API_DOCUMENT_FILE_INJECT_KEY } from '~/constants/api-document-file-inject-key'

const { apiDocumentFile } = inject(API_DOCUMENT_FILE_INJECT_KEY, { apiDocumentFile: null })
</script>

<template>
  <template v-if="apiDocumentFile">
    <JsonCodeView
      class="size-full"
      :value="apiDocumentFile"
      theme="vs"
    />
  </template>
</template>

<style scoped lang="postcss">
</style>
