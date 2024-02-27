<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  schema: OpenAPIV3.NonArraySchemaObject
}>()
</script>

<template>
  <template v-if="$props.schema.type === 'string'">
    <template v-if="$props.schema.enum">
      <template v-for="(value, index) in $props.schema.enum" :key="index">
        <span class="schema-string">"{{ value }}"</span>
        <span v-if="index !== $props.schema.enum.length - 1" class="schema-operator"> | </span>
      </template>
    </template>

    <span v-else class="schema-builtin">string</span>
  </template>
</template>

<style scoped lang="postcss">
</style>
