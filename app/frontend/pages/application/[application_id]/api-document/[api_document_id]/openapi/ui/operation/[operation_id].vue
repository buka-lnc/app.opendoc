<script setup lang="ts">
import { OPENDOC_OPERATIONS_INJECT_KEY } from '~/constants/opendoc-operations-inject-key'

const { operations } = inject(OPENDOC_OPERATIONS_INJECT_KEY, { operations: [] })

const route = useRoute()
const operation = computed(() => toValue(operations).find(operation => operation.id === route.params.operation_id))

const deprecated = computed(() => operation.value?.deprecated || false)
const pathname = computed(() => operation.value?.pathname || 'unknown')
const method = computed(() => operation.value?.method || 'unknown')

const textColor = useOpenapiMethodTextColor(method)
const color = computed(() => (deprecated.value ? 'text-gray-600' : textColor.value))
</script>

<template>
  <div class="p-10 bg-base-300">
    <div
      class="text-2xl space-x-2"
      :class="deprecated && 'line-through opacity-60'"
    >
      <span class="flex-0 uppercase" :class="!deprecated && color">
        {{ method }}
      </span>
      <span>
        {{ pathname }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
