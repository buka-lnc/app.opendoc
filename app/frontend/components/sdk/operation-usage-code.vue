<script setup lang="ts">
import { codeToHtml } from 'shiki'
import { Sdk } from '~/api/backend/components/schemas'

const props = defineProps<{
  sdk: Sdk
}>()

const sdk = toRef(props, 'sdk')

const { data } = useAsyncData(
  async () => {
    if (!sdk.value) return ''
    const fullName = sdk.value.name

    return await codeToHtml(`
import { operationId } from '${fullName}/operations'

await operationId({
  // options
})
  `, {
      lang: 'typescript',
      theme: 'nord',
    })
  },
  {
    default: () => '',
    watch: [sdk],
  },
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
