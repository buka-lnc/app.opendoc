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
      <!-- <sdk-readme-openapi-core v-if="sdk.compiler === 'openapi-core'" :sdk="sdk" />
      <sdk-readme-openapi-react v-else-if="sdk.compiler === 'openapi-react'" :sdk="sdk" /> -->
    </template>
  </div>
</template>

<style scoped lang="postcss">
</style>
