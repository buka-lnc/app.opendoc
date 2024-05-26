<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { querySdk } from '~/api/backend/query_sdk.js'

const sdkId = useRouteParams<string>('sdk_id')

const { pending, data: sdk } = useAsyncData(
  async () => await querySdk<'200'>({
    sdkId: sdkId.value,
  }),
)
</script>

<template>
  <div class="size-full flex justify-around items-stretch overflow-y-auto font-sans">
    <stuffed-loading :pending="pending" />

    <template v-if="sdk && !pending">
      <sdk-readme-asyncapi-core v-if="sdk.compiler === 'asyncapi-core'" :sdk="sdk" />
    </template>
  </div>
</template>

<style scoped lang="postcss">
</style>
