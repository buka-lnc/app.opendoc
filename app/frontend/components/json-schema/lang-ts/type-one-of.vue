<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  schema: OpenAPIV3.SchemaObject
}>()
</script>

<template>
  <template v-if="'oneOf' in schema">
    <json-schema-lang-ts-block :schema="schema">
      <template #head>
        <slot name="head" />
      </template>

      <template v-for="(value, index) in schema.oneOf" :key="index">
        <json-schema-lang-ts-type
          v-bind="$attrs"
          :schema="value"
        >
          <template #head>
            <span class="schema-operator"> | </span>
          </template>
        </json-schema-lang-ts-type>
      </template>

      <template #tail>
        <slot name="tail" />
      </template>
    </json-schema-lang-ts-block>
  </template>
</template>

<style scoped lang="postcss">
</style>
