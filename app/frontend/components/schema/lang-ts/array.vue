<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  schema: OpenAPIV3.ArraySchemaObject
}>()
</script>

<template>
  <span v-if="$props.schema.type === 'array'">
    <schema-lang-ts-type
      v-if="$props.schema.items"
      :schema="$props.schema.items"
    />
  </span>
</template>

<style scoped lang="postcss">
</style>
