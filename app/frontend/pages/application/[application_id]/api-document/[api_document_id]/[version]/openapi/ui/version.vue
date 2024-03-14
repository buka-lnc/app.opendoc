<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { queryApiDocumentFilesByApiDocumentId } from '~/api/backend/query_api_document_files_by_api_document_id.js'

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/openapi/ui/version`)

const { pending, data: apiDocumentFiles } = useAsyncData(
  async () => {
    const apiDocumentFiles = await queryApiDocumentFilesByApiDocumentId<200>({
      apiDocumentId: apiDocumentId.value,
    })

    return apiDocumentFiles
  },
  {
    default: () => [],
  },
)
</script>

<template>
  <StuffedLoading v-if="pending" :pending="pending" />
  <div v-if="!pending" class="p-10">
    <div
      v-for="apiDocumentFile in apiDocumentFiles"
      :key="apiDocumentFile.id"
      class="d-card bg-base-300"
    >
      <div class="d-card-body py-2 flex flex-row items-center justify-between">
        <h2 class="d-card-title">
          v{{ apiDocumentFile.version }}
        </h2>
        <div class="d-card-actions">
          <NuxtLink
            :to="prefix"
            class="d-btn d-btn-sm font-sans"
          >
            查看
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
