<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import * as R from 'ramda'
import { queryApiDocumentFilesByApiDocumentId } from '~/api/backend/query_api_document_files_by_api_document_id.js'

// const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
// const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/openapi/ui/version`)

const { pending, data: apiDocumentFiles } = useAsyncData(
  async () => {
    const apiDocumentFiles = await queryApiDocumentFilesByApiDocumentId<'200'>({
      apiDocumentId: apiDocumentId.value,
    })

    return apiDocumentFiles
  },
  {
    default: () => [],
  },
)

const tagVersionMap = computed(() => {
  const tags = R.groupBy(
    file => file.tag || 'latest',
    apiDocumentFiles.value,
  )

  const tagMap: Record<string, string> = {}

  for (const [tag, files] of Object.entries(tags)) {
    if (files?.length) {
      tagMap[tag] = files[0].version
    }
  }

  return tagMap
})
</script>

<template>
  <StuffedLoading v-if="pending" :pending="pending" />
  <div v-if="!pending" class="p-10">
    <div
      v-for="apiDocumentFile in apiDocumentFiles"
      :key="apiDocumentFile.id"
      class="d-card bg-base-300 rounded-sm"
    >
      <div class="d-card-body py-2 flex flex-row items-center justify-between">
        <div class="flex items-center space-x-2">
          <h2 class="d-card-title inline-block">
            v{{ apiDocumentFile.version }}
          </h2>

          <sdk-status-badge :status="apiDocumentFile.sdk?.status" />

          <span
            v-if="tagVersionMap[apiDocumentFile.tag || 'latest'] === apiDocumentFile.version"
            class="d-badge d-badge-outline d-badge-secondary"
          >
            {{ apiDocumentFile.tag || 'latest' }}
          </span>
        </div>

        <div class="d-card-actions">
          <NuxtLink
            :to="{ params: { ...$route.params, version: apiDocumentFile.version }}"
            class="d-btn d-btn-sm font-sans"
            :aria-disabled="version === apiDocumentFile.version"
            :class="version === apiDocumentFile.version && 'd-btn-disabled'"
          >
            {{ version === apiDocumentFile.version ? '当前版本' : '查看' }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
