<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

const props = defineProps<{
  show: boolean
  schema?: OpenAPIV3.SchemaObject
}>()

</script>

<template>
  <mouse-popover
    v-if="props.schema?.description || props.schema?.example"
    :show="props.show"
  >
    <div class="p-4">
      <div>{{ props.schema?.description }}</div>
      <div v-if="props.schema?.example">
        <pre>{{ props.schema.example }}</pre>
      </div>
    </div>
  </mouse-popover>
</template>

<style scoped lang="postcss">
</style>
