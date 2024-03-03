<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
import { OPENDOC_REFERENCE_MAP_INJECT_KEY } from '~/constants/opendoc-reference-map-inject-key'

const { referenceMap } = inject(OPENDOC_REFERENCE_MAP_INJECT_KEY, { referenceMap: new Map() })

const props = defineProps<{
  name: string
  value: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  required: boolean
}>()

const resolvedSchema = ref<OpenAPIV3.SchemaObject | undefined>()
const arrayDimension = ref(0)
const referencePath = ref<string[]>([])

watch(
  () => props.value,
  () => {
    arrayDimension.value = 0
    referencePath.value = []

    function flattenRef (schema: OpenAPIV3.ReferenceObject): OpenAPIV3.SchemaObject | undefined {
      const ref = schema.$ref
      const result = toValue(referenceMap).get(ref)
      if (!result) return

      referencePath.value.push(...result.path)
      if (!result.schema) return

      if (result.schema.type === 'array') {
        return flattenArray(result.schema)
      }

      return result.schema
    }

    function flattenArray (schema: OpenAPIV3.ArraySchemaObject): OpenAPIV3.SchemaObject | undefined {
      if (!(typeof schema.items === 'object')) return schema

      arrayDimension.value += arrayDimension.value + 1
      const items = schema.items
      if ('$ref' in items && items.$ref) return flattenRef(items)

      return items as OpenAPIV3.SchemaObject
    }

    if ('$ref' in props.value && props.value.$ref) {
      resolvedSchema.value = flattenRef(props.value)
    } else if ('type' in props.value && props.value.type === 'array') {
      resolvedSchema.value = flattenArray(props.value)
    } else {
      resolvedSchema.value = props.value as OpenAPIV3.SchemaObject
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

const [fold, toggleFold] = useToggle(true)

const [showPopover, toggleShowPopover] = useToggle(false)
</script>

<template>
  <div
    class="relative pl-6 schema-line schema-block-start"
    @mouseover="toggleShowPopover(true)"
    @mouseleave="toggleShowPopover(false)"
  >
    <span>{{ name }}</span>
    <span v-if="!$props.required">?</span>

    <span class="pr-2">:</span>

    <span
      v-if="!fold && referencePath.length > 0"
      class="bg-base-200 text-base-content/70 px-1 rounded-sm mr-2"
    >
      <span>&lt;</span>
      <schema-lang-ts-ref :reference="referencePath[referencePath.length - 1]" />
      <schema-lang-ts-array-dimension :dimension="arrayDimension" />
      <span>&gt;</span>
    </span>

    <span v-if="fold && referencePath.length > 0">
      <schema-lang-ts-ref
        class="schema-constant"
        :reference="referencePath[referencePath.length - 1]"
      />
      <schema-lang-ts-array-dimension :dimension="arrayDimension" />

      <button
        class="cursor-pointer mx-2 hover:font-bold"
        @click="toggleFold(false)"
      >
        {...}
      </button>
    </span>

    <span v-if="isBasicType">
      <schema-lang-ts-popover
        :show="showPopover"
        :schema="resolvedSchema"
      />

      <schema-lang-ts-type :schema="value" />
      <schema-lang-ts-array-dimension :dimension="arrayDimension" />
    </span>

    <button
      v-if="!fold && isObject && referencePath.length > 0"
      class="schema-punctuation hover:font-bold"
      @click="toggleFold(true)"
    >
      {...
    </button>

    <span v-if="isObject && !referencePath.length" class="schema-punctuation">{</span>
  </div>

  <div
    v-if="!fold && isObject && resolvedSchema?.properties"
    class="pl-6 schema-block"
  >
    <schema-lang-ts-properties
      :properties="resolvedSchema.properties"
      :required="resolvedSchema.required"
    />
  </div>

  <div v-if="!fold && isObject" class="pl-6 schema-line schema-block-end">
    <span class="schema-punctuation">}</span>
    <schema-lang-ts-array-dimension :dimension="arrayDimension" />
  </div>
</template>
