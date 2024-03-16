<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema: OpenAPIV3.ArraySchemaObject | OpenAPIV3.ReferenceObject
}>()

const dereference = useDereferenceFn()

const resolvedSchema = ref<OpenAPIV3.SchemaObject | undefined>()
const arrayDimension = ref(0)
const referencePath = ref<string[]>([])

watch(
  () => props.schema,
  () => {
    arrayDimension.value = 0
    referencePath.value = []

    function flattenRef (schema: OpenAPIV3.ReferenceObject): OpenAPIV3.SchemaObject | undefined {
      const [result, paths] = dereference<OpenAPIV3.SchemaObject>(schema)
      referencePath.value.push(...paths)

      if (!result) return
      if (result.type === 'array') return flattenArray(result)

      return result
    }

    function flattenArray (schema: OpenAPIV3.ArraySchemaObject): OpenAPIV3.SchemaObject | undefined {
      if (!(typeof schema.items === 'object')) return schema

      arrayDimension.value += arrayDimension.value + 1
      const items = schema.items
      if ('$ref' in items && items.$ref) return flattenRef(items)

      return items as OpenAPIV3.SchemaObject
    }

    if ('$ref' in props.schema && props.schema.$ref) {
      resolvedSchema.value = flattenRef(props.schema)
    } else if ('type' in props.schema && props.schema.type === 'array') {
      resolvedSchema.value = flattenArray(props.schema)
    } else {
      resolvedSchema.value = props.schema as OpenAPIV3.SchemaObject
    }
  },
  {
    immediate: true,
  },
)

const isBasicType = computed(() => {
  if (!resolvedSchema.value) return false
  if (!('type' in resolvedSchema.value)) return false
  if (!resolvedSchema.value.type) return false

  return resolvedSchema.value.type !== 'object' && resolvedSchema.value.type !== 'array'
})
const isObject = computed(() => !!resolvedSchema.value && 'type' in resolvedSchema.value && resolvedSchema.value.type === 'object')

const [showPopover, toggleShowPopover] = useToggle(false)
</script>

<template>
  <div v-if="isObject" class="schema-line schema-punctuation">
    <span
      v-if="referencePath.length > 0"
      class="bg-base-200 text-base-content/70 px-1 rounded-sm"
    >
      <span>&lt;</span>
      <json-schema-lang-ts-ref :reference="referencePath[referencePath.length - 1]" />
      <json-schema-lang-ts-array-dimension :dimension="arrayDimension" />
      <span>&gt;</span>
    </span>
    {
  </div>

  <div v-if="isObject && resolvedSchema">
    <json-schema-lang-ts-properties
      v-if="resolvedSchema.properties"
      :properties="resolvedSchema.properties"
      :required="resolvedSchema.required"
    />
  </div>

  <div
    class="relative pl-6 schema-line schema-block-start"
    @mouseover="toggleShowPopover(true)"
    @mouseleave="toggleShowPopover(false)"
  >
    <span v-if="isBasicType && resolvedSchema">
      <json-schema-lang-ts-popover
        :show="showPopover"
        :schema="resolvedSchema"
      />

      <json-schema-lang-ts-base-type :schema="resolvedSchema" />
      <json-schema-lang-ts-array-dimension :dimension="arrayDimension" />
    </span>
  </div>

  <div v-if="isObject" class="schema-line">
    <span class="schema-punctuation">}</span>
    <json-schema-lang-ts-array-dimension :dimension="arrayDimension" />
  </div>
</template>

<style scoped lang="postcss">
</style>
