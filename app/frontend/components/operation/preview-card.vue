<script setup lang="ts">
import { OpendocOperation } from '~/types/opendoc-operation.js'

const props = defineProps<{
  operation: OpendocOperation
}>()

const deprecated = computed(() => !!props.operation.deprecated)
</script>

<template>
  <div class="flex items-start py-2 px-2 space-x-1 h-full">
    <OperationIcon :operation="props.operation" />

    <div class="flex flex-col justify-center h-full">
      <span
        class="leading-4"
        :class="deprecated && 'text-gray-600'"
      >
        {{ props.operation.title }}
      </span>
      <span
        class="text-xs leading-4 text-gray-400"
        :class="deprecated && 'text-gray-600'"
      >
        {{ props.operation.pathname }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
