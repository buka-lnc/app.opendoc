<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  schema: OpenAPIV3.SchemaObject
  toReference:(referenceId: string, reference: string) => string
}>()
</script>

<template>
  <template v-if="schema.allOf && schema.allOf.length > 1">
    <json-schema-lang-ts-block v-bind="$attrs" :schema="schema">
      <template #head>
        <slot name="head" />
      </template>

      <template v-for="(value, index) in schema.allOf" :key="index">
        <json-schema-lang-ts-type
          v-bind="$attrs"
          :schema="value"
          :to-reference="$props.toReference"
        >
          <template #head>
            <span class="schema-operator"> & </span>
          </template>
        </json-schema-lang-ts-type>
      </template>

      <template #tail>
        <slot name="tail" />
      </template>
    </json-schema-lang-ts-block>
  </template>
  <template v-else-if="schema.allOf && schema.allOf.length === 1">
    <json-schema-lang-ts-type
      v-bind="$attrs"
      :schema="schema.allOf[0]"
      :to-reference="$props.toReference"
    >
      <template #head>
        <slot name="head" />
      </template>
      <template #tail>
        <slot name="tail" />
      </template>
    </json-schema-lang-ts-type>
  </template>
</template>

<style scoped lang="postcss">
</style>
