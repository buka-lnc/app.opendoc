<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { querySdksByVersion } from '~/api/backend'

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/openapi/ui/sdk`)

const { pending, data: sdks } = useAsyncData(
  async () => await querySdksByVersion<'200'>({
    apiDocumentId: apiDocumentId.value,
    version: version.value,
  }),
)
</script>

<template>
  <div class="size-full flex items-stretch ">
    <stuffed-loading :pending="pending" />

    <div class="h-full overflow-y-auto overflow-x-hidden">
      <ul class="flex-0 flex-nowrap d-menu d-menu-sm bg-base-200 p-0 h-full w-72">
        <li v-for="sdk in sdks" :key="sdk.id">
          <NuxtLink
            class="rounded-none w-full truncate"
            :to="`${prefix}/${sdk.id}`"
            active-class="d-active"
          >
            {{ sdk.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="flex-1 bg-base-300">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
