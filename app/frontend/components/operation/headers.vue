<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'

const props = defineProps<{
  operation: OpenAPIV3.OperationObject
}>()

const dereference = useDereferenceFn()

const headers = computed(() => {
  const parameterReferences = props.operation.parameters || []

  const headers = parameterReferences
    .map(parameter => dereference<OpenAPIV3.ParameterObject>(parameter)[0])
    .filter(R.isNotNil)
    .filter(parameter => parameter.in === 'header')

  return headers
})

const schema = useOpenapiParametersToJsonSchema(headers)
</script>

<template>
  <schema-lang-ts-type v-if="schema" :schema="schema" />
  <empty-placeholder v-else class="flex-1 py-8" />
</template>

<style scoped lang="postcss">
</style>
