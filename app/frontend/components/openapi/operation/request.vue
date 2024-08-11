<script setup lang="ts">
import { IconCircleFilled } from '@tabler/icons-vue'
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'

const props = defineProps<{
  operation: OpenAPIV3.OperationObject
  toReference:(referenceId: string, reference: string) => string
}>()

const route = useRoute()
const active = computed(() => route.query.requestActive as string || 'headers')

const dereference = useDereferenceFn()

const parameters = computed(
  () => (props.operation.parameters || [])
    .map(parameter => dereference<OpenAPIV3.ParameterObject>(parameter)[0])
    .filter(R.isNotNil),
)

const headers = useArrayFilter(parameters, p => p.in === 'header')
const headersSchema = useOpenapiParametersToJsonSchema(headers)

const query = useArrayFilter(parameters, p => p.in === 'query')
const querySchema = useOpenapiParametersToJsonSchema(query)

const params = useArrayFilter(parameters, p => p.in === 'path')
const paramsSchema = useOpenapiParametersToJsonSchema(params)

const requestBody = computed(() => dereference<OpenAPIV3.RequestBodyObject>(props.operation.requestBody)[0])
</script>

<template>
  <div>
    <div role="tablist" class="d-tabs d-tabs-lifted tab-base-200">
      <NuxtLink
        role="tab"
        class="d-tab relative"
        :class="active === 'headers' && 'd-tab-active'"
        aria-label="Headers"
        :to="{ query: { ...route.query, requestActive: 'headers' } }"
      >
        <div class="flex items-center space-x-1">
          <span>Headers</span>
          <icon-circle-filled v-if="headers.length" class="size-2 text-success" />
        </div>
      </NuxtLink>

      <NuxtLink
        role="tab"
        class="d-tab relative"
        :class="active === 'query' && 'd-tab-active'"
        aria-label="Query"
        :to="{ query: { ...route.query, requestActive: 'query' } }"
      >
        <div class="flex items-center space-x-1">
          <span>Query</span>
          <icon-circle-filled v-if="query.length" class="size-2 text-success" />
        </div>
      </NuxtLink>

      <NuxtLink
        role="tab"
        class="d-tab relative"
        :class="active === 'params' && 'd-tab-active'"
        aria-label="Params"
        :to="{ query: { ...route.query, requestActive: 'params' } }"
      >
        <div class="flex items-center space-x-1">
          <span>Params</span>
          <icon-circle-filled v-if="params.length" class="size-2 text-success" />
        </div>
      </NuxtLink>

      <NuxtLink
        role="tab"
        class="d-tab relative"
        :class="active === 'body' && 'd-tab-active'"
        aria-label="Query"
        :to="{ query: { ...route.query, requestActive: 'body' } }"
      >
        <div class="flex items-center space-x-1">
          <span>Body</span>
          <icon-circle-filled v-if="requestBody?.content" class="size-2 text-success" />
        </div>
      </NuxtLink>
    </div>

    <FlexibleDiv
      role="tabpanel"
      class="d-tab-content tab-base-200 block rounded-box"
      :class="{
        'rounded-tl-none': active === 'headers',
        'rounded-tr-none': active === 'body',
      }"
    >
      <div class="p-6">
        <div v-if="active=== 'headers'">
          <json-schema-lang-ts
            v-if="headersSchema"
            :schema="headersSchema"
            :to-reference="toReference"
          />
          <empty-placeholder v-else class="flex-1 py-8" />
        </div>

        <div v-if="active=== 'query'">
          <json-schema-lang-ts
            v-if="querySchema"
            :schema="querySchema"
            :to-reference="toReference"
          />
          <empty-placeholder v-else class="flex-1 py-8" />
        </div>

        <div v-if="active=== 'params'">
          <json-schema-lang-ts
            v-if="paramsSchema"
            :schema="paramsSchema"
            :to-reference="toReference"
          />
          <empty-placeholder v-else class="flex-1 py-8" />
        </div>

        <div v-if="active=== 'body'">
          <openapi-operation-body
            v-if="requestBody?.content"
            :body="requestBody?.content"
            :to-reference="toReference"
          />
          <empty-placeholder v-else class="flex-1 py-8" />
        </div>
      </div>
    </FlexibleDiv>
  </div>
</template>

<style scoped lang="postcss">
</style>
