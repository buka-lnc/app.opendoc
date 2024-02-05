<script setup lang="ts">
const props = defineProps<{
  pending: boolean
}>()

</script>
<template>
  <div v-if="props.pending" class="h-full w-full grid place-content-center bg-base-300">
    <span class="d-loading d-loading-ring d-loading-lg" />
  </div>

  <slot v-if="!props.pending" />
</template>
