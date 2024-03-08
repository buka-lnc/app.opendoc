<script setup lang="ts">
import * as R from 'ramda'
import { OpenAPIV3 } from 'openapi-types'
import { OPENDOC_OPERATIONS_INJECT_KEY } from '~/constants/opendoc-operations-inject-key'

const dereference = useDereferenceFn()
const { operations } = inject(OPENDOC_OPERATIONS_INJECT_KEY, { operations: [] })

const route = useRoute()
const operation = computed(() => toValue(operations).find(operation => operation.id === route.params.operation_id))

const deprecated = computed(() => operation.value?.deprecated || false)
const pathname = computed(() => operation.value?.pathname || 'unknown')
const method = computed(() => operation.value?.method || 'unknown')

const textColor = useOpenapiMethodTextColor(method)
const color = computed(() => (deprecated.value ? 'text-gray-600' : textColor.value))

const description = computed(() => operation.value?.description || 'No description')

const responses = computed(
  () => R.mapObjIndexed(
    response => dereference<OpenAPIV3.ResponseObject>(response)[0],
    operation.value?.value.responses || {},
  ),
)
</script>

<template>
  <div class="p-10 bg-base-300 space-y-8 overflow-y-auto size-full">
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

    <div class="text-xl font-bold text-base-content/70">
      Request
    </div>

    <operation-request
      v-if="operation"
      :operation="operation.value"
    />

    <template v-for="(response, code) in responses" :key="code">
      <template v-if="response">
        <div class="flex flex-col">
          <div class="text-xl font-bold text-base-content/70">
            Response {{ code }}
          </div>
          <div v-if="response" class="text-sm text-base-content/40">
            {{ response.description }}
          </div>
        </div>

        <operation-response
          :code="<string>code"
          :response="response"
        />
      </template>
    </template>
  </div>
</template>

<style scoped lang="postcss">
</style>
