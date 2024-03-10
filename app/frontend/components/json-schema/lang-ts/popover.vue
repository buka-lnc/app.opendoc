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
    <div class="px-4 py-2 text-sm font-mono max-w-64">
      <div v-if="props.schema?.description" class="inline-flex">
        <span class="flex-0 w-14 opacity-80">描述</span>
        <span class="font-bold">{{ props.schema?.description }}</span>
      </div>
      <div v-if="props.schema?.example" class="flex">
        <span class="flex-0 w-14 opacity-80">示例</span>
        <pre class="font-bold">{{ props.schema.example }}</pre>
      </div>
    </div>
  </mouse-popover>
</template>

<style scoped lang="postcss">
</style>
