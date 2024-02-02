<script setup lang="ts">
import { RiQuestionLine } from '@remixicon/vue'

const props = defineProps<{
  tip: string
}>()
</script>
<template>
  <span class="d-tooltip" :data-tip="props.tip">
    <RiQuestionLine size="18px" />
  </span>
</template>
