<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps<{
  properties: OpenAPIV3.NonArraySchemaObject['properties']
}>()
</script>

<template>
  <template
    v-for="value in Object.entries($props.properties || {})"
    :key="value[0]"
  >
    <schema-lang-ts-property :name="value[0]" :value="value[1]" />
  </template>
</template>
