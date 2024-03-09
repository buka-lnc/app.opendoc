<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  schema?: OpenAPIV3.SchemaObject
}>()
</script>

<template>
  <div
    v-if="props.schema?.description || $props.schema?.example"
    class="pl-6"
  >
    <pre>/**</pre>
    <template v-if="props.schema?.description">
      <pre> * @description {{ props.schema.description }}</pre>
    </template>
    <template v-if="props.schema?.example">
      <pre> * @example {{ $props.schema?.example }}</pre>
    </template>
    <pre> */</pre>
  </div>
</template>

<style scoped lang="postcss">
</style>
