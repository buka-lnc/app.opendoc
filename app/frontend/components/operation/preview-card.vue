<script setup lang="ts">
import { OpendocOperation } from '~/types/opendoc-operation.js'

const props = defineProps<{
  operation: OpendocOperation
}>()

const deprecated = computed(() => !!props.operation.deprecated)
</script>

<template>
  <div
    class="d-tooltip d-tooltip-right flex items-start py-2 px-2 space-x-1 size-full"
    :data-tip="operation.description"
  >
    <div class="flex-0">
      <OperationIcon :operation="props.operation" />
    </div>

    <div class="flex-auto flex flex-col justify-center items-start h-full overflow-hidden">
      <span
        class="leading-4 max-w-full truncate"
        :class="deprecated && 'text-gray-600'"
      >
        {{ props.operation.title }}
      </span>
      <span
        class="text-xs leading-4 text-gray-400 max-w-full truncate"
        :class="deprecated && 'text-gray-600'"
      >
        {{ props.operation.pathname }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
