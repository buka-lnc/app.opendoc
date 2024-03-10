<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col">
    <span class="text-xs text-base-content/60 font-sans">
      <slot name="label" />
    </span>

    <span class="text-base-content/90 font-sans">
      <slot />
    </span>
  </div>
</template>

<style scoped lang="postcss">
</style>
