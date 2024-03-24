<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  name: string
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  required: boolean
}>()
</script>

<template>
  <json-schema-lang-ts-type :schema="$props.schema">
    <template #head>
      <span>{{ name }}</span>
      <span v-if="!$props.required">?</span>

      <span class="pr-2">:</span>
    </template>
  </json-schema-lang-ts-type>
</template>
