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

const description = computed(() => operation.value?.description || 'No description')
</script>

<template>
  <div class="p-10 bg-base-300 space-y-8">
    <div>
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

      <div>{{ description }}</div>
    </div>

    <operation-request
      v-if="operation"
      :operation="operation.value"
    />

    <div class="text-xl font-bold text-base-content/70">
      Response
    </div>

    <div role="tablist" class="d-tabs d-tabs-lifted">
      <a role="tab" class="d-tab d-tab-active">Response Header</a>
      <div role="tabpanel" class="d-tab-content bg-base-100 border-base-300 rounded-box p-6">
        123
      </div>

      <a role="tab" class="d-tab">Response Body</a>
      <div role="tabpanel" class="d-tab-content bg-base-100 border-base-300 rounded-box p-6">
        123
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
