<script setup lang="ts">
import { Sdk } from '~/api/backend/components/schemas'

const props = defineProps<{
  sdk: Sdk
}>()

const sdk = toRef(props, 'sdk')

const code = computed(() => `
echo "@${sdk.value.scope}:registry=${window.location.origin}/api/registry" >> .npmrc
npm install ${sdk.value.fullName}@${sdk.value.version.version}
`)
</script>

<template>
  <sdk-code language="bash" :code="code" />
</template>

<style scoped lang="postcss">
</style>
