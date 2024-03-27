<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue'
const model = defineModel<string>({ required: true })
</script>

<template>
  <label class="d-input d-input-bordered d-input-xs flex items-center gap-2">
    <input v-model="model" type="text" class="grow" placeholder="Search">
    <IconSearch class="size-4" />
  </label>
</template>

<style scoped lang="postcss">
</style>
