<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <span class="group inline-flex items-center space-x-1">
    <span>{{ $props.text }}</span>

    <clipboard-icon
      class="transition-opacity opacity-0 group-hover:opacity-100"
      :text="$props.text"
    />
  </span>
</template>

<style scoped lang="postcss">
</style>
