<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}>()

const schema = computed(() => props.schema)

const [resolvedSchema] = useDereference<OpenAPIV3.SchemaObject>(schema)
</script>

<template>
  <json-schema-lang-ts-type-object
    v-if="resolvedSchema?.type === 'object'"
    v-bind="$attrs"
    :schema="schema as any"
  >
    <template #head>
      <slot name="head" />
    </template>
    <template #tail>
      <slot name="tail" />
    </template>
  </json-schema-lang-ts-type-object>

  <json-schema-lang-ts-type-array
    v-if="resolvedSchema?.type === 'array'"
    v-bind="$attrs"
    :schema="schema as any"
  >
    <template #head>
      <slot name="head" />
    </template>
    <template #tail>
      <slot name="tail" />
    </template>
  </json-schema-lang-ts-type-array>

  <json-schema-lang-ts-type-basic v-else-if="resolvedSchema?.type && ['string', 'number', 'integer', 'boolean'].includes(resolvedSchema.type)" v-bind="$attrs" :schema="schema as any">
    <template #head>
      <slot name="head" />
    </template>
    <template #tail>
      <slot name="tail" />
    </template>
  </json-schema-lang-ts-type-basic>

  <json-schema-lang-ts-type-extends v-else v-bind="$attrs" :schema="schema as any">
    <template #head>
      <slot name="head" />
    </template>
    <template #tail>
      <slot name="tail" />
    </template>
  </json-schema-lang-ts-type-extends>
</template>

<style scoped lang="postcss">
</style>
