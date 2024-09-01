<script setup lang="ts">
defineProps<{
  loading: boolean
}>()

defineEmits<{
  click: [MouseEvent]
}>()
</script>

<template>
  <button
    class="d-btn"
    :disabled="loading"
    @click="$emit('click', $event)"
  >
    <span
      v-if="loading"
      class="d-loading d-loading-sm d-loading-spinner"
    />

    <slot />
  </button>
</template>

<style scoped lang="postcss">
</style>
