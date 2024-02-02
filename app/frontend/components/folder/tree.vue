<script setup lang="ts">
import { FOLDERS_INJECT_KEY } from './constants'
import { queryFolders } from '~/api/backend'

const { data: folders, execute } = useAsyncData(async () => {
  const folders = await queryFolders()
  return folders
})

provide(FOLDERS_INJECT_KEY, {
  folders,
  reloadFolders: execute,
})
</script>

<template>
  <ul class="menu text-sm text-base-content px-4 w-full ">
    <li v-for="folder in folders" :key="folder.id">
      <folder-item :folder="folder" />
    </li>
  </ul>
</template>
<style lane="postcss" scoped>
.menu:not(:last-child)::after {
  @apply top-3 bottom-3 w-px;

  top: 0.75rem;
  bottom: 0.75rem;

  position: absolute;
  content: '';
}
</style>
