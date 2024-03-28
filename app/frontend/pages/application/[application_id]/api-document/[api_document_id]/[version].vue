<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { queryRawApiDocumentFileByVersion } from '~/api/backend/query_raw_api_document_file_by_version.js'
import { API_DOCUMENT_FILE_INJECT_KEY } from '~/constants/api-document-file-inject-key.js'

const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')

const { pending, data: apiDocumentFile } = useAsyncData(
  async () => {
    const file = await queryRawApiDocumentFileByVersion({
      apiDocumentId: apiDocumentId.value,
      version: version.value,
    })
      .resolveWith('text')

    return file
  },
  {
    immediate: true,
  },
)

provide(API_DOCUMENT_FILE_INJECT_KEY, {
  apiDocumentFile,
})
</script>

<template>
  <div v-if="!pending" class="size-full">
    <NuxtPage />
  </div>
</template>

<style scoped lang="postcss">
</style>
