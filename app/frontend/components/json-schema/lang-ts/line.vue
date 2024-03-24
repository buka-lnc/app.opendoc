<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types';

defineProps<{
  schema?: OpenAPIV3.SchemaObject
}>()

const [showPopover, toggleShowPopover] = useToggle(false)
</script>

<template>
  <div
    class="relative schema-line"
  >
    <json-schema-lang-ts-popover
      v-if="$props.schema"
      :show="showPopover"
      :schema="$props.schema"
    />

    <slot />
  </div>
</template>

<style scoped lang="postcss">
</style>
