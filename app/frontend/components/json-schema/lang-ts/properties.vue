<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  properties: OpenAPIV3.NonArraySchemaObject['properties']
  required: OpenAPIV3.NonArraySchemaObject['required']
}>()
</script>

<template>
  <template
    v-for="value in Object.entries($props.properties || {})"
    :key="value[0]"
  >
    <json-schema-lang-ts-property
      v-bind="$attrs"
      :name="value[0]"
      :value="value[1]"
      :required="$props.required?.includes(value[0]) || false"
    />
  </template>
</template>
