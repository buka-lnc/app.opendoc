<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}>()
const schema = computed(() => props.schema)
</script>

<template>
  <json-schema-lang-ts-ref
    v-if="'$ref' in schema && schema.$ref"
    :reference="schema.$ref"
  />
  <template v-else-if="'type' in schema">
    <json-schema-lang-ts-object v-if="schema.type === 'object'" :schema="schema" />
    <json-schema-lang-ts-array v-else-if="schema.type === 'array'" :schema="schema" />
    <json-schema-lang-ts-string v-else-if="schema.type === 'string'" :schema="schema" />
    <span v-else-if="schema.type === 'integer'" class="schema-builtin">integer</span>
    <span v-else-if="schema.type === 'number'" class="schema-builtin">number</span>
    <span v-else-if="schema.type === 'boolean'" class="schema-builtin">boolean</span>
    <span v-else-if="schema.type === 'file'" class="schema-constant">File</span>
    <span v-else class="schema-builtin">unknown</span>
  </template>
</template>

<style scoped lang="postcss">
</style>
