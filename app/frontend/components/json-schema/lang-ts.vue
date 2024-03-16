<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}>()

const schema = toRef(props, 'schema')

const [resolvedSchema] = useDereference<OpenAPIV3.SchemaObject>(schema)
const [showPopover, toggleShowPopover] = useToggle(false)

const isBasicType = computed(() => {
  if (!resolvedSchema.value) return false
  if (!('type' in resolvedSchema.value)) return false
  if (!resolvedSchema.value.type) return false

  return resolvedSchema.value.type !== 'object' && resolvedSchema.value.type !== 'array'
})
const isObject = computed(() => !!resolvedSchema.value && 'type' in resolvedSchema.value && resolvedSchema.value.type === 'object')
const isArray = computed(() => !!resolvedSchema.value && 'type' in resolvedSchema.value && resolvedSchema.value.type === 'array')
</script>

<template>
  <json-schema-lang-ts-object
    v-if="isObject"
    :schema="schema as OpenAPIV3.NonArraySchemaObject"
  />

  <json-schema-lang-ts-array
    v-else-if="isArray && resolvedSchema"
    :schema="resolvedSchema as OpenAPIV3.ArraySchemaObject"
  />

  <div
    v-else-if="isBasicType && resolvedSchema"
    class="relative pl-6 schema-line schema-block-start"
    @mouseover="toggleShowPopover(true)"
    @mouseleave="toggleShowPopover(false)"
  >
    <span>
      <json-schema-lang-ts-popover
        :show="showPopover"
        :schema="resolvedSchema"
      />

      <json-schema-lang-ts-base-type :schema="resolvedSchema" />
    </span>
  </div>
</template>

<style scoped lang="postcss">
</style>
