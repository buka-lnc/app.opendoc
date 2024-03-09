<script setup lang="ts">
import { IconCircleFilled } from '@tabler/icons-vue'
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'

const props = defineProps<{
  operation: OpenAPIV3.OperationObject
}>()

// 高度动画
const panel = ref()
const panelContent = ref()
const panelContentSize = useElementSize(panelContent)
watchEffect(() => {
  if (!panel.value || !panelContentSize.height.value) return
  panel.value.style.height = `${panelContentSize.height.value}px`
})

const route = useRoute()
const active = computed(() => route.query.requestActive as string || 'headers')

const dereference = useDereferenceFn()

const parameters = computed(
  () => (props.operation.parameters || [])
    .map(parameter => dereference<OpenAPIV3.ParameterObject>(parameter)[0])
    .filter(R.isNotNil),
)

const headers = computed(() => {
  const headers = parameters.value
    .filter(parameter => parameter.in === 'header')

  return headers
})
const headersSchema = useOpenapiParametersToJsonSchema(headers)

const query = computed(() => {
  const headers = parameters.value
    .filter(parameter => parameter.in === 'query')

  return headers
})
const querySchema = useOpenapiParametersToJsonSchema(query)

const requestBody = computed(() => dereference<OpenAPIV3.RequestBodyObject>(props.operation.requestBody)[0])
</script>

<template>
  <div>
    <div role="tablist" class="d-tabs d-tabs-lifted">
      <NuxtLink
        role="tab"
        class="d-tab relative"
        :class="active === 'headers' && 'd-tab-active !bg-base-100/20'"
        aria-label="Headers"
        :to="{ query: { ...$route.query, requestActive: 'headers' } }"
      >
        <div class="flex items-center space-x-1">
          <span>Headers</span>
          <icon-circle-filled v-if="headers.length" class="size-2 text-success" />
        </div>
      </NuxtLink>

      <NuxtLink
        role="tab"
        class="d-tab relative"
        :class="active === 'query' && 'd-tab-active !bg-base-100/20'"
        aria-label="Query"
        :to="{ query: { ...$route.query, requestActive: 'query' } }"
      >
        <div class="flex items-center space-x-1">
          <span>Query</span>
          <icon-circle-filled v-if="query.length" class="size-2 text-success" />
        </div>
      </NuxtLink>

      <NuxtLink
        role="tab"
        class="d-tab relative"
        :class="active === 'body' && 'd-tab-active !bg-base-100/20'"
        aria-label="Query"
        :to="{ query: { ...$route.query, requestActive: 'body' } }"
      >
        <div class="flex items-center space-x-1">
          <span>Body</span>
          <icon-circle-filled v-if="requestBody?.content" class="size-2 text-success" />
        </div>
      </NuxtLink>
    </div>

    <div
      ref="panel"
      role="tabpanel"
      class="d-tab-content block bg-base-100/20 border-base-300 rounded-box transition-[height]"
      :class="{
        'rounded-tl-none': active === 'headers',
        'rounded-tr-none': active === 'body',
      }"
    >
      <div ref="panelContent" class="overflow-hidden">
        <div class="p-6">
          <div v-if="active=== 'headers'">
            <json-schema-lang-ts-type v-if="headersSchema" :schema="headersSchema" />
            <empty-placeholder v-else class="flex-1 py-8" />
          </div>

          <div v-if="active=== 'query'">
            <json-schema-lang-ts-type v-if="querySchema" :schema="querySchema" />
            <empty-placeholder v-else class="flex-1 py-8" />
          </div>

          <div v-if="active=== 'body'">
            <openapi-operation-body v-if="requestBody?.content" :body="requestBody?.content" />
            <empty-placeholder v-else class="flex-1 py-8" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
