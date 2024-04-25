<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  toReference:(referenceId: string, reference: string) => string
}>()
</script>

<template>
  <json-schema-lang-ts
    :schema="props.schema"
    :to-reference="props.toReference"
  />
</template>

<style scoped lang="postcss">
</style>
