<script setup lang="ts">
import { IconCircleFilled } from '@tabler/icons-vue'
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'

const props = defineProps<{
  code: string
  response: OpenAPIV3.ResponseObject
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
const activeQueryKey = computed(() => `response${props.code}Active`)
const active = computed(() => route.query[activeQueryKey.value] as string || 'headers')

const dereference = useDereferenceFn()
const response = toRef(props, 'response')

const headers = computed(
  () => Object.entries(response.value?.headers || {})
    .map(([name, header]): (OpenAPIV3.ParameterObject | undefined) => {
      const target = dereference<OpenAPIV3.HeaderObject>(header)[0]
      if (!target) return undefined

      return { ...target, name, in: 'headers' }
    })
    .filter(R.isNotNil),
)
const headersSchema = useOpenapiParametersToJsonSchema(headers)
</script>

<template>
  <div class="space-y-4">
    <div>
      <div role="tablist" class="d-tabs d-tabs-lifted">
        <NuxtLink
          role="tab"
          class="d-tab relative"
          :class="active === 'headers' && 'd-tab-active !bg-base-100/20'"
          aria-label="Headers"
          :to="{ query: { ...$route.query, [activeQueryKey]: 'headers' } }"
        >
          <div class="flex items-center space-x-1">
            <span>Headers</span>
            <icon-circle-filled v-if="headers.length" class="size-2 text-success" />
          </div>
        </NuxtLink>

        <NuxtLink
          role="tab"
          class="d-tab relative"
          :class="active === 'body' && 'd-tab-active !bg-base-100/20'"
          aria-label="Query"
          :to="{ query: { ...$route.query, [activeQueryKey]: 'body' } }"
        >
          <div class="flex items-center space-x-1">
            <span>Body</span>
            <icon-circle-filled v-if="response.content" class="size-2 text-success" />
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
              <json-schema-lang-ts v-if="headersSchema" :schema="headersSchema" />
              <empty-placeholder v-else class="flex-1 py-8" />
            </div>

            <div v-if="active=== 'body'">
              <openapi-operation-body v-if="response.content" :body="response.content" />
              <empty-placeholder v-else class="flex-1 py-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
