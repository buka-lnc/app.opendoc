<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  schema: OpenAPIV3.NonArraySchemaObject
}>()
</script>

<template>
  <template v-if="$props.schema.type === 'object'">
    <div class="schema-line schema-punctuation">
      {
    </div>

    <div>
      <schema-lang-ts-properties
        v-if="$props.schema.properties"
        :properties="$props.schema.properties"
        :required="$props.schema.required"
      />
    </div>

    <div class="schema-line schema-punctuation">
      }
    </div>
  </template>
</template>

<style scoped lang="postcss">
</style>
