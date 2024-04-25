<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  name: string
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  required: boolean
  toReference:(referenceId: string, reference: string) => string
}>()
</script>

<template>
  <json-schema-lang-ts-type
    :schema="$props.schema"
    :to-reference="$props.toReference"
  >
    <template #head>
      <span>{{ name }}</span>
      <span v-if="!$props.required">?</span>

      <span class="pr-2">:</span>
    </template>
  </json-schema-lang-ts-type>
</template>
