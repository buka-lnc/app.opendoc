<script setup lang="ts">
import * as R from 'ramda'
defineProps<{
  dimension: number
}>()
</script>

<template>
  <template
    v-for="i in R.range(0, dimension)"
    :key="i"
  >
    <span>[</span><span>]</span>
  </template>
</template>

<style scoped lang="postcss">
</style>
