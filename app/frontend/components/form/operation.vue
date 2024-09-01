<script setup lang="ts">
defineProps<{
  pending: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="flex justify-between my-8 hover:bg-ctp-overlay0/10 rounded-sm py-2 px-3">
    <div class="flex flex-col justify-center">
      <span class="font-bold">
        <slot name="title" />
      </span>
      <span class="text-sm text-base-content/70">
        <slot name="description" />
      </span>
    </div>

    <slot />
  </div>
</template>

<style scoped lang="postcss">
</style>
