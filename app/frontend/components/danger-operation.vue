<script setup lang="ts">
defineProps<{
  pending: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="flex justify-between my-8 max-w-md">
    <div class="flex flex-col justify-center">
      <span class="font-bold">
        <slot name="title" />
      </span>
      <span class="text-sm text-base-content/70">
        <slot name="description" />
      </span>
    </div>

    <button
      class="d-btn d-btn-error"
      :disabled="pending"
      @click="$emit('click')"
    >
      <span v-show="pending" class="d-loading d-loading-sm d-loading-spinner" />

      <slot />
    </button>
  </div>
</template>

<style scoped lang="postcss">
</style>
