<script setup lang="ts">
const route = useRoute()
const apiDocumentId = computed(() => String(route.params.api_document_id))
const { isLoadingApiDocumentFile, apiDocumentFile } = useApiDocumentFile(apiDocumentId)

</script>
<template>
  <div class="h-full overflow-y-scroll overflow-x-hidden">
    <stuffed-loading :pending="isLoadingApiDocumentFile">
      <markdown v-if="!!apiDocumentFile" :content="apiDocumentFile" />
    </stuffed-loading>
  </div>
</template>
