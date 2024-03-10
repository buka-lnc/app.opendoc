<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col">
    <div class="text-xl font-bold text-base-content/70">
      <slot />
    </div>

    <div v-if="$slots.description" class="text-sm text-base-content/40 font-sans">
      <slot name="description" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
