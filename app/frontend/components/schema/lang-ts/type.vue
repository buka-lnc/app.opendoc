<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}>()
const schema = computed(() => props.schema)
</script>

<template>
  <schema-lang-ts-ref v-if="'$ref' in schema && schema.$ref" :schema="schema" />
  <template v-else-if="'type' in schema">
    <schema-lang-ts-object v-if="schema.type === 'object'" :schema="schema" />
    <schema-lang-ts-array v-else-if="schema.type === 'array'" :schema="schema" />
    <schema-lang-ts-string v-else-if="schema.type === 'string'" :schema="schema" />
    <span v-else-if="schema.type === 'integer'" class="schema-builtin">integer</span>
    <span v-else-if="schema.type === 'number'" class="schema-builtin">number</span>
    <span v-else-if="schema.type === 'boolean'" class="schema-builtin">boolean</span>
    <span v-else class="schema-builtin">unknown</span>
  </template>
</template>

<style scoped lang="postcss">
</style>
