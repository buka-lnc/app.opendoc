<script setup lang="ts">
import { RiFileCodeFill, RiTableFill } from '@remixicon/vue'

const props = defineProps<{
  folderId: string
  apiDocumentId: string
}>()

const prefix = computed(() => `/folder/${props.folderId}/api-document/${props.apiDocumentId}`)
</script>
<template>
  <div class="d-join">
    <NuxtLink
      class="d-btn d-join-item"
      :to="`${prefix}/openapi-table`"
      active-class="d-btn-active"
    >
      <RiTableFill />
    </NuxtLink>

    <NuxtLink
      class="d-btn d-join-item"
      :to="`${prefix}/openapi-code`"
      active-class="d-btn-active"
    >
      <RiFileCodeFill />
    </NuxtLink>
  </div>
</template>
