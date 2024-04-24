<script setup lang="ts">
import { Sdk } from '~/api/backend/components/schemas'

const props = defineProps<{
  sdk: Sdk
}>()

const sdk = toRef(props, 'sdk')

const code = computed(() => `
import { useOperationId } from '${sdk.value.fullName}/hooks'

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
`)
</script>

<template>
  <sdk-code
    language="jsx"
    :code="code"
  />
</template>

<style scoped lang="postcss">
</style>
