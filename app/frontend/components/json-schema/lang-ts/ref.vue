<script setup lang="ts">
import md5 from 'md5'

const props = defineProps<{
  reference: string
}>()

const id = computed(() => md5(props.reference))
const title = computed(() => props.reference.split('/').pop())
</script>

<template>
  <NuxtLink
    class="schema-ref"
    :to="`/application/${$route.params.application_id}/api-document/${$route.params.api_document_id}/openapi/ui/schema/${id}`"
  >
    {{ title }}
  </NuxtLink>
</template>

<style scoped lang="postcss">
</style>
