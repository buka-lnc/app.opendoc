<script setup lang="ts">
import { Sdk } from '~/api/backend/components/schemas'

const props = defineProps<{
  sdk: Sdk
}>()

const sdk = toRef(props, 'sdk')

const code = computed(() => `
import { request } from '${sdk.value.fullName}/request'

request.use(async(ctx, next) => {
  await next()

  const response = ctx.response
  if (response && response.status >= 400) {
    const body = await response.text()
    throw new Error(body)
  }
})
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
