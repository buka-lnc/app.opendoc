<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.NonArraySchemaObject | OpenAPIV3.ReferenceObject
  toReference:(referenceId: string, reference: string) => string
}>()

const [resolvedSchema, referencePath] = useDereference<OpenAPIV3.NonArraySchemaObject>(props.schema)

const fold = ref(true)
</script>

<template>
  <json-schema-lang-ts-type-plain-object
    v-if="resolvedSchema"
    v-model:fold="fold"
    :foldable="referencePath.length > 0"
    :schema="resolvedSchema"
    :to-reference="props.toReference"
  >
    <template #head>
      <slot name="head" />

      <span
        v-if="referencePath.length > 0"
        :class="!fold && 'bg-base-200 text-base-content/70 px-1 rounded-sm mr-2'"
      >
        <span v-if="!fold">&lt;</span>
        <json-schema-lang-ts-ref
          :class="fold && 'schema-constant'"
          :reference="referencePath[referencePath.length - 1]"
          :to-reference="props.toReference"
        />
        <span v-if="!fold">&gt;</span>
      </span>
    </template>

    <template #tail>
      <slot name="tail" />
    </template>
  </json-schema-lang-ts-type-plain-object>
</template>

<style scoped lang="postcss">
</style>
