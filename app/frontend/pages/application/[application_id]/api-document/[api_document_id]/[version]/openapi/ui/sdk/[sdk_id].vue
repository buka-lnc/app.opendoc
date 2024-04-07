<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { querySdkById } from '~/api/backend'

const sdkId = useRouteParams<string>('sdk_id')

const { pending, data: sdk } = useAsyncData(
  async () => await querySdkById<'200'>({
    sdkId: sdkId.value,
  }),
)
</script>

<template>
  <div class="size-full flex justify-around items-stretch overflow-y-auto font-sans">
    <stuffed-loading :pending="pending" />
    <sdk-readme-openapi-core v-if="sdk && !pending && sdk.compiler === 'openapi-core'" :sdk="sdk" />
  </div>
</template>

<style scoped lang="postcss">
</style>
