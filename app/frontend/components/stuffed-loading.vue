<script setup lang="ts">
const props = defineProps<{
  pending: boolean
}>()

</script>
<template>
  <div v-if="props.pending" class="h-full w-full grid place-content-center">
    <span class="d-loading d-loading-ring d-loading-lg" />
  </div>

  <slot v-if="!props.pending" />
</template>
