<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

withDefaults(
  defineProps<{
    properties: OpenAPIV3.NonArraySchemaObject['properties']
    required: string[]
    toReference:(referenceId: string, reference: string) => string
  }>(),
  {
    required: () => ([]),
    properties: () => ({}),
  },
)
</script>

<template>
  <template
    v-for="value in Object.entries($props.properties || {})"
    :key="value[0]"
  >
    <json-schema-lang-ts-property
      v-bind="$attrs"
      :name="value[0]"
      :schema="value[1]"
      :required="$props.required?.includes(value[0]) || false"
      :to-reference="$props.toReference"
    />
  </template>
</template>
