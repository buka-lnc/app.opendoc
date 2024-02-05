<script setup lang="ts">
const route = useRoute()
const apiDocumentId = computed(() => String(route.params.api_document_id))
const { isLoadingApiDocumentFile, apiDocumentFile } = useApiDocumentFile(apiDocumentId)
</script>
<template>
  <stuffed-loading :pending="isLoadingApiDocumentFile">
    <div>123</div>
  </stuffed-loading>
</template>
