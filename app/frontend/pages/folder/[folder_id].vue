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

</script>
<template>
  <NuxtLoadingIndicator v-if="isLoadingFolder || isLoadingApiDocuments" />

  <div v-if="folder" class="w-full h-screen flex flex-col overflow-hidden">
    <div class="flex-0 w-full bg-base-100">
      <h1 class="text-4xl p-4">
        {{ folder.title }}
      </h1>
      <p>{{ folder.code }}</p>
      <p>{{ folder.mpath }}</p>

      <div role="tablist" class="d-tabs d-tabs-lifted">
        <template v-for="apiDocument in apiDocuments" :key="apiDocument.id">
          <NuxtLink
            role="tab"
            class="d-tab flex items-center"
            active-class="d-tab-active"
            :to="`/folder/${folderId}/api-document/${apiDocument.id}`"
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
