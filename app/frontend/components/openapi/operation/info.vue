<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'

const props = defineProps<{
  operation: OpenAPIV3.OperationObject
}>()

const operationId = computed(() => props.operation.operationId)
const summary = computed(() => props.operation.summary || 'No summary')
const security = computed(() => {
  if (!props.operation.security) return []

  return R.unnest(
    props.operation.security
      .map(requirement => Object.keys(requirement)),
  )
})
</script>

<template>
  <div>
    <div class="flex justify-stretch">
      <section-field class="flex-1">
        <template #label>
          概要/Summary
        </template>

        <template #default>
          {{ summary }}
        </template>
      </section-field>

      <section-field class="flex-1">
        <template #label>
          OperationId
        </template>
        <template #default>
          <clipboard-span v-if="operationId" :text="operationId" />
          <span v-else>-</span>
        </template>
      </section-field>

      <section-field class="flex-1">
        <template #label>
          Security
        </template>
        <template #default>
          <span v-if="security.length">
            {{ security.join(', ') }}
          </span>
          <span v-if="!security.length">-</span>
        </template>
      </section-field>
    </div>

    <!-- <section-field>
      <template #label>
        描述/Description
      </template>
      <template #default>
        {{ description }}
      </template>
    </section-field> -->
  </div>
</template>

<style scoped lang="postcss">
</style>
