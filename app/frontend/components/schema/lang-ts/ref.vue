<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
import md5 from 'md5'
import { OPENDOC_SCHEMAS_INJECT_KEY } from '~/constants/opendoc-schemas-inject-key'

const props = defineProps<{
  schema: OpenAPIV3.ReferenceObject
}>()

const { schemas } = inject(OPENDOC_SCHEMAS_INJECT_KEY, { schemas: [] })
const schema = computed(() => toValue(schemas).find(s => s.id === md5(props.schema.$ref))?.value)
</script>

<template>
  <span>
    <schema-lang-ts-type v-if="schema" :schema="schema" />
  </span>
</template>

<style scoped lang="postcss">
</style>
