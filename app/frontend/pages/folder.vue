<script setup lang="ts">
import { queryFolders } from '~/api/backend'
import { Folder } from '~/api/backend/components/schemas'

definePageMeta({
  alias: '/',
})

const { data: folders, pending, execute } = useAsyncData(async () => {
  const folders = await queryFolders()
  return folders
}, {
  default: () => <Folder[]>[],
})

const tree = useFolderTree(folders)
</script>
<template>
  <NuxtLoadingIndicator v-if="pending" />

  <div class="flex">
    <div class="bg-base-100 w-80 min-h-screen">
      <div class="px-5 py-3 mb-4 select-none">
        <a class="btn btn-sm btn-link text-base-content no-underline hover:no-underline text-3xl">
          OpenDoc
        </a>
        <span class="text-xs">1.0.0</span>
      </div>

      <folder-tree
        class="px-4"
        :folders="tree"
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
