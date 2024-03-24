<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  schema: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ReferenceObject
}>()

const [resolvedSchema] = useDereference<OpenAPIV3.NonArraySchemaObject>(props.schema)
</script>

<template>
  <template v-if="resolvedSchema && resolvedSchema.type && ['string', 'number', 'integer', 'boolean'].includes(resolvedSchema.type)">
    <json-schema-lang-ts-line
      v-bind="$attrs"
      :schema="resolvedSchema"
    >
      <slot name="head" />

      <template v-if="resolvedSchema.enum">
        <template v-for="(value, index) in resolvedSchema.enum" :key="index">
          <span class="schema-string">"{{ value }}"</span>
          <span v-if="index !== resolvedSchema.enum.length - 1" class="schema-operator"> | </span>
        </template>
      </template>

      <span v-else-if="resolvedSchema.type === 'string'" class="schema-builtin">string</span>
      <span v-else-if="resolvedSchema.type === 'number'" class="schema-builtin">number</span>
      <span v-else-if="resolvedSchema.type === 'integer'" class="schema-builtin">integer</span>
      <span v-else-if="resolvedSchema.type === 'boolean'" class="schema-builtin">boolean</span>
      <slot name="tail" />
    </json-schema-lang-ts-line>
  </template>
</template>

<style scoped lang="postcss">
</style>
