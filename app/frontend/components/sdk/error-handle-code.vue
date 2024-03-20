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
    const fullName = sdk.value.fullName

    return await codeToHtml(`
import { request } from '${fullName}/request'

request.use(async(ctx, next) => {
  await next()

  const response = ctx.response
  if (response && response.status >= 400) {
    const body = await response.text()
    throw new Error(body)
  }
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
