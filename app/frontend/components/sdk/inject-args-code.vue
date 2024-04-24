<script setup lang="ts">
import { Sdk } from '~/api/backend/components/schemas'

const props = defineProps<{
  sdk: Sdk
}>()

const sdk = toRef(props, 'sdk')

const code = computed(() => `
import { operationId } from '${sdk.value.fullName}/operations'

await operationId(/* args */)
  // 添加未定义在 args 中的参数
  .set('not-defined-header', 'value')
  .query('not-defined-query', 'value')
  // 关闭自动重定向
  .redirect('manual')
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
