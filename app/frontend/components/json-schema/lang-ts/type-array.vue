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

const fold = ref(true)
</script>

<template>
  <json-schema-lang-ts-type-plain-object
    v-if="resolvedSchema && resolvedSchema.type === 'object'"
    :schema="resolvedSchema"
    :foldable="referencePath.length > 0"
    v-model:fold="fold"
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
        />
        <json-schema-lang-ts-array-dimension :dimension="arrayDimension" />
        <span v-if="!fold">&gt;</span>
      </span>
    </template>

    <template #tail>
      <slot name="tail" />
    </template>
  </json-schema-lang-ts-type-plain-object>

  <json-schema-lang-ts-type
    v-else-if="resolvedSchema && resolvedSchema.type !== 'array'"
    :schema="resolvedSchema"
  >
    <template #head>
      <slot name="head" />
    </template>

    <template #tail>
      <json-schema-lang-ts-array-dimension :dimension="arrayDimension" />
    </template>
  </json-schema-lang-ts-type>
</template>

<style scoped lang="postcss">
</style>
