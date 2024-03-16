<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ReferenceObject
}>()

const schema = toRef(props, 'schema')

const [resolvedSchema, referencePath] = useDereference<OpenAPIV3.NonArraySchemaObject>(schema)

</script>

<template>
  <template v-if="resolvedSchema">
    <div class="schema-line schema-punctuation">
      <span
        v-if="referencePath.length > 0"
        class="bg-base-200 text-base-content/70 px-1 rounded-sm"
      >
        <span>&lt;</span>
        <json-schema-lang-ts-ref :reference="referencePath[referencePath.length - 1]" />
        <span>&gt;</span>
      </span>
      {
    </div>

    <div>
      <json-schema-lang-ts-properties
        v-if="resolvedSchema.properties"
        :properties="resolvedSchema.properties"
        :required="resolvedSchema.required"
      />
    </div>

    <div class="schema-line schema-punctuation">
      }
    </div>
  </template>
</template>

<style scoped lang="postcss">
</style>
