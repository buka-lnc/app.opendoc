<script setup lang="ts">
defineProps<{
  referencePath: string[]
}>()
</script>

<template>
  <span
    v-if="referencePath.length > 0"
    class="bg-base-200 text-base-content/70 px-1 rounded-sm"
  >
    <span>&lt;</span>
    <json-schema-lang-ts-ref :reference="referencePath[referencePath.length - 1]" />
    <span>&gt;</span>
  </span>
</template>

<style scoped lang="postcss">
</style>
