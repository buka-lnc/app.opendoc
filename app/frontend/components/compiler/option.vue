<script setup lang="ts">
import { CompilerOption } from '~/api/backend/components/schemas'

defineProps<{
  option: CompilerOption
}>()
</script>

<template>
  <label v-if="option.format === 'string'">
    string
  </label>
  <label v-else-if="option.format === 'number'">
    number
  </label>
  <label v-else-if="option.format === 'boolean'">
    boolean
  </label>
</template>

<style scoped lang="postcss">
</style>
