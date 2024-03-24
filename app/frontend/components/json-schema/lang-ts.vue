<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}>()

const schema = toRef(props, 'schema')

const [resolvedSchema, referencePath] = useDereference<OpenAPIV3.SchemaObject>(schema)
</script>

<template>
  <json-schema-lang-ts-type-plain-object
    v-if="resolvedSchema?.type === 'object'"
    :schema="resolvedSchema as OpenAPIV3.NonArraySchemaObject"
  >
    <template #head>
      <span
        v-if="referencePath.length > 0"
        class="bg-base-200 text-base-content/70 px-1 rounded-sm mr-2"
      >
        <span>&lt;</span>
        <json-schema-lang-ts-ref
          :reference="referencePath[referencePath.length - 1]"
        />
        <span>&gt;</span>
      </span>
    </template>
  </json-schema-lang-ts-type-plain-object>

  <json-schema-lang-ts-type
    v-else
    :schema="schema as OpenAPIV3.NonArraySchemaObject"
  />
</template>

<style scoped lang="postcss">
</style>
