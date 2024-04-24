<script setup lang="ts">
import { codeToHtml } from 'shiki'

const props = defineProps<{
  code: string
  language: string
}>()

const code = toRef(props, 'code')
const language = toRef(props, 'language')

const data = computedAsync(
  () => codeToHtml(code.value.trim(), {
    lang: language.value,
    theme: 'nord',
  }),
  '',
)
</script>

<template>
  <div
    class="d-mockup-code [&_code]:inline-block"
    v-html="data"
  />
</template>

<style scoped lang="postcss">
</style>
