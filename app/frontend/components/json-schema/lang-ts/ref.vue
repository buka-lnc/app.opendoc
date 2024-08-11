<script setup lang="ts">
import md5 from 'md5'

const props = defineProps<{
  reference: string
  toReference:(referenceId: string, reference: string) => string
}>()

const id = computed(() => md5(props.reference))
const title = computed(() => props.reference.split('/').pop())
const href = computed(() => props.toReference(id.value, props.reference))
</script>

<template>
  <NuxtLink
    class="schema-ref"
    :to="href"
  >
    {{ title }}
  </NuxtLink>
</template>

<style scoped lang="postcss">
</style>
