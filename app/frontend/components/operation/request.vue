<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  operation: OpenAPIV3.OperationObject
}>()

const checked = ref('headers')

const panel = ref()
const panelContent = ref()
const panelContentSize = useElementSize(panelContent)

watchEffect(() => {
  if (!panel.value || !panelContentSize.height.value) return

  panel.value.style.height = `${panelContentSize.height.value}px`
})
</script>

<template>
  <div class="space-y-4">
    <div class="text-xl font-bold text-base-content/70">
      Request
    </div>

    <div>
      <div role="tablist" class="d-tabs d-tabs-lifted">
        <input
          v-model="checked"
          type="radio"
          name="request-body"
          role="tab"
          class="d-tab"
          value="headers"
          aria-label="Headers"
        >

        <input
          v-model="checked"
          type="radio"
          name="request-body"
          role="tab"
          class="d-tab"
          aria-label="Query"
          value="query"
        >

        <input
          v-model="checked"
          type="radio"
          name="request-body"
          role="tab"
          class="d-tab"
          aria-label="Body"
          value="body"
        >
      </div>

      <div
        ref="panel"
        role="tabpanel"
        class="d-tab-content block bg-base-100 border-base-300 rounded-box transition-[height]"
        :class="{
          'rounded-tl-none': checked === 'headers',
          'rounded-tr-none': checked === 'body',
        }"
      >
        <div ref="panelContent" class="overflow-hidden">
          <div class="p-6">
            <div v-if="checked=== 'headers'">
              <operation-headers :operation="operation" />
            </div>

            <div v-if="checked=== 'query'">
              <operation-request-body v-if="false" :operation="operation" />
              <empty-placeholder v-else class="flex-1 py-8" />
            </div>

            <div v-if="checked=== 'body'">
              <operation-request-body v-if="operation" :operation="operation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
