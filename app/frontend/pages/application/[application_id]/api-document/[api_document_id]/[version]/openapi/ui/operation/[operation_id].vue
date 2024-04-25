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
const description = computed(() => operation.value?.description || 'No description')

const textColor = useOpenapiMethodTextColor(method)
const color = computed(() => (deprecated.value ? 'text-gray-600' : textColor.value))

const responses = computed(
  () => R.mapObjIndexed(
    response => dereference<OpenAPIV3.ResponseObject>(response)[0],
    operation.value?.value.responses || {},
  ),
)

const toReference = useOpenapiToReference()
</script>

<template>
  <div v-if="operation" class="p-10 bg-base-300 space-y-10 overflow-y-auto size-full">
    <div>
      <div
        class="text-2xl space-x-2 flex"
        :class="deprecated && 'line-through opacity-60'"
      >
        <span class="flex-0 uppercase" :class="!deprecated && color">
          {{ method }}
        </span>

        <clipboard-span
          :class="deprecated && 'line-through'"
          :text="pathname"
        />
      </div>
      <span class="font-sans text-base-content/90">{{ description }}</span>
    </div>

    <section-block>
      <openapi-operation-info :operation="operation.value" />
    </section-block>

    <section-block>
      <template #title>
        Request
      </template>

      <openapi-operation-request
        :operation="operation.value"
        :to-reference="toReference"
      />
    </section-block>

    <template v-for="(response, code) in responses" :key="code">
      <section-block v-if="response">
        <template #title>
          Response {{ code }}
        </template>

        <template v-if="response" #description>
          {{ response.description }}
        </template>

        <template #default>
          <openapi-operation-response
            :code="<string>code"
            :response="response"
            :to-reference="toReference"
          />
        </template>
      </section-block>
    </template>
  </div>
</template>

<style scoped lang="postcss">
</style>
