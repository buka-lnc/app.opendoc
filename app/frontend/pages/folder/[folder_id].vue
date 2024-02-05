<script setup lang="ts">
import { OpenApiInitiativeIcon } from 'vue3-simple-icons'
import { queryApiDocuments, queryFolder } from '~/api/backend'
import { ApiDocument } from '~/api/backend/components/schemas'

const route = useRoute()
const folderId = computed(() => String(route.params.folder_id))

const { data: folder, pending: isLoadingFolder } = useAsyncData(
  async () => await queryFolder({
    folderIdOrMpath: folderId.value,
  }),
)

const { data: apiDocuments, pending: isLoadingApiDocuments } = useAsyncData(
  async () => await queryApiDocuments({
    folderId: folderId.value,
  }),
  {
    default: () => <ApiDocument[]>[],
  },
)

const activeApiDocumentId = ref<string>('')
watchEffect(() => {
  if (!apiDocuments.value.length) {
    return
  }

  if (apiDocuments.value.some(apiDocument => apiDocument.id === activeApiDocumentId.value)) {
    return
  }

  activeApiDocumentId.value = apiDocuments.value[0].id
})

function toLink (apiDocument: ApiDocument): string {
  if (apiDocument.type === 'readme') {
    return `/folder/${folderId.value}/api-document/${apiDocument.id}/readme`
  } else if (apiDocument.type === 'openapi') {
    return `/folder/${folderId.value}/api-document/${apiDocument.id}/openapi-code`
  }
  return `/folder/${folderId.value}/api-document/${apiDocument.id}/asyncapi-code`
}

</script>
<template>
  <NuxtLoadingIndicator v-if="isLoadingFolder || isLoadingApiDocuments" />

  <div v-if="folder" class="w-full h-screen flex flex-col overflow-hidden">
    <div class="flex-0 w-full bg-base-100">
      <div class="py-3 px-5">
        <div class="mb-1">
          <h1 class="inline text-3xl">
            {{ folder.title }}
          </h1>
          <span class="ml-1 text-xs">1.0.0</span>
        </div>
        <span class="text-gray-400">{{ folder.mpath.substring(0, folder.mpath.length - 1) }}</span>
      </div>

      <div role="tablist" class="d-tabs d-tabs-lifted">
        <template v-for="apiDocument in apiDocuments" :key="apiDocument.id">
          <NuxtLink
            role="tab"
            class="d-tab flex items-center"
            active-class="d-tab-active"
            :to="toLink(apiDocument)"
          >
            <OpenApiInitiativeIcon class="fill-base-content w-4 h-4 mx-1" />

            {{ apiDocument.title }}
          </NuxtLink>
        </template>
      </div>
    </div>

    <div class="flex-grow flex-shrink overflow-hidden">
      <NuxtPage />
    </div>
  </div>
</template>
