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
import { useOperationId } from '${fullName}/hooks'

export function Component(props) {
  const { data, error, loading } = useOperationId(
    {
      //options
    },
    // [deps],
  )

  if (loading) return <Loading />
  if (error) return <Error />
  if (!data) return <div>No data</div>

  return <div>{JSON.stringify(data)}</div>
}
  `, {
      lang: 'jsx',
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
