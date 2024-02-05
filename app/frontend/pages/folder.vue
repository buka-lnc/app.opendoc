<script setup lang="ts">
import { queryFolders } from '~/api/backend'
import { ParsedFolder } from '~/types/parsed-folder'

definePageMeta({
  alias: '/',
})

const { data: folders, pending, execute } = useAsyncData(async () => {
  const folders = await queryFolders()
  return folders.map((folder): ParsedFolder => ({
    ...folder,
    mpaths: folder.mpath.split('/').filter(Boolean),
  }))
}, {
  default: () => <ParsedFolder[]>[],
})

// const tree = useFolderTree(folders)
</script>
<template>
  <NuxtLoadingIndicator v-if="pending" />

  <div class="flex">
    <div class="bg-base-200 w-80 min-h-screen">
      <!-- <div class="px-5 py-3 mb-4 select-none">
        <a class="btn btn-sm btn-link text-base-content no-underline hover:no-underline text-3xl">
          OpenDoc
        </a>
        <span class="text-xs">1.0.0</span>
      </div> -->

      <div class="p-4">
        <input
          type="text"
          class="d-input w-full"
          placeholder="Search"
        >
      </div>

      <folder-tree
        class="px-4"
        :folders="folders"
        :active-folder-id="String($route.params.folder_id)"
        @created="execute"
        @deleted="execute"
      />
    </div>

    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
<style scoped lang="postcss">
</style>
