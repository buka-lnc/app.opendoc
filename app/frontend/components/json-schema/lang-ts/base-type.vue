<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.SchemaObject
}>()
const schema = computed(() => props.schema)
</script>

<template>
  <json-schema-lang-ts-string v-if="schema.type === 'string'" :schema="schema" />
  <span v-else-if="schema.type === 'integer'" class="schema-builtin">integer</span>
  <span v-else-if="schema.type === 'number'" class="schema-builtin">number</span>
  <span v-else-if="schema.type === 'boolean'" class="schema-builtin">boolean</span>
  <span v-else-if="(schema.type as any) === 'file'" class="schema-constant">File</span>
  <span v-else class="schema-builtin">unknown</span>
</template>

<style scoped lang="postcss">
</style>
