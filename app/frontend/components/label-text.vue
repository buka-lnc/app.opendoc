<script setup lang="ts">
const props = defineProps<{
  tip: string
}>()
</script>
<template>
  <span class="label-text flex items-center">
    <span><slot /></span>

    <helper v-if="$props.tip" class="ml-1" :tip="props.tip" />
  </span>
</template>
