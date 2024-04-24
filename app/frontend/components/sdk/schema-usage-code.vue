<script setup lang="ts">
import { Sdk } from '~/api/backend/components/schemas'

const props = defineProps<{
  sdk: Sdk
}>()

const sdk = toRef(props, 'sdk')

const code = computed(() => `import type { SchemaName } from '${sdk.value.fullName}/schemas'

const schema: SchemaName = {
  // data
}
`)

</script>

<template>
  <sdk-code
    language="typescript"
    :code="code"
  />
</template>

<style scoped lang="postcss">
</style>
