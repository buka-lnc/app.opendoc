<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
import md5 from 'md5'
import { OPENDOC_SCHEMAS_INJECT_KEY } from '~/constants/opendoc-schemas-inject-key'

const { schemas } = inject(OPENDOC_SCHEMAS_INJECT_KEY, { schemas: [] })

const props = defineProps<{
  name: string
  value: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
}>()
console.log('🚀 ~ props:', props)

function decodeReference ($ref: string): OpenAPIV3.SchemaObject | undefined {
  const pool = toValue(schemas)
  let target: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined = { $ref }

  while (target && '$ref' in target) {
    const id: string = md5(target.$ref)
    target = pool.find(s => s.id === id)?.value
  }

  return target
}

const schema = computed(() => {
  const value = props.value

  if ('type' in value) return value
  if ('$ref' in value) return decodeReference(value.$ref)

  return undefined
})

const schemaItems = computed(() => {
  if (!schema.value || !('type' in schema.value) || schema.value.type !== 'array') return undefined
  if (typeof schema.value.items !== 'object') return undefined

  return '$ref' in schema.value.items ? decodeReference(schema.value.items.$ref) : schema.value.items
})

const isObject = computed(() => !!schema.value && 'type' in schema.value && schema.value.type === 'object')
const isArray = computed(() => !!schema.value && 'type' in schema.value && schema.value.type === 'array')
const isArrayObject = computed(() => {
  const value = schemaItems.value
  if (!value) return false
  return value.type === 'object'
})
</script>

<template>
  <div class="pl-6 schema-line schema-block-start">
    <span>{{ name }}</span>
    <span class="pr-2">:</span>
    <span v-if="!isObject && !isArray">
      <schema-lang-ts-type :schema="value" />
      <span v-if="isArray">[]</span>
    </span>
    <span v-if="isObject || isArrayObject" class="schema-punctuation">{</span>
  </div>
  <div v-if="isObject && schema?.properties" class="pl-6 schema-block">
    <schema-lang-ts-properties :properties="schema.properties" />
  </div>
  <div v-if="isArrayObject && schemaItems?.properties" class="pl-6 schema-block">
    <schema-lang-ts-properties :properties="schemaItems.properties" />
  </div>
  <div v-if="isObject || isArrayObject" class="pl-6 schema-line schema-block-end">
    <span class="schema-punctuation">}</span>
    <span v-if="isArray">[]</span>
  </div>
</template>
