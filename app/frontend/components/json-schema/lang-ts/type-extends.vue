<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  schema: OpenAPIV3.NonArraySchemaObject | undefined
}>()
</script>

<template>
  <json-schema-lang-ts-line
    v-if="$props.schema"
    :schema="$props.schema"
  >
    <slot name="head" />
    <template v-if="$props.schema?.enum">
      <template v-for="(value, index) in $props.schema.enum" :key="index">
        <span class="schema-string">"{{ value }}"</span>
        <span v-if="index !== $props.schema.enum.length - 1" class="schema-operator"> | </span>
      </template>
    </template>

    <span v-if="(schema?.type as any) === 'file'" class="schema-constant">File</span>
    <span v-else class="schema-builtin">unknown</span>

    <slot name="tail" />
  </json-schema-lang-ts-line>
</template>

<style scoped lang="postcss">
</style>
