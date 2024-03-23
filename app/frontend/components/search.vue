<script setup lang="ts">
const model = defineModel({ required: true })
</script>

<template>
  <label class="d-input d-input-bordered d-input-xs flex items-center gap-2">
    <input type="text" class="grow" placeholder="Search" v-model="model" />
    <IconSearch class="size-4" />
  </label>
</template>

<style scoped lang="postcss">
</style>
