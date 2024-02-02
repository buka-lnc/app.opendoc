<script setup lang="ts">
import {
  RiDeleteBinLine,
  RiFolderAddLine,
  RiFolderLine,
  RiMore2Line,
} from '@remixicon/vue'
import { ref } from 'vue'
import { FOLDERS_INJECT_KEY } from './constants'
import { Folder } from '~/api/backend/components/schemas'

const { reloadFolders } = inject(FOLDERS_INJECT_KEY, {
  folders: [],
  reloadFolders: async () => {},
})

const props = defineProps<{
  folder: Folder
}>()

const showCreateDialog = ref(false)
function openCreateDialog () {
  showCreateDialog.value = true
  const el = document.activeElement as HTMLElement

  if (el) {
    el.blur()
  }
}
async function reload () {
  showCreateDialog.value = false
  await reloadFolders()
}

const folder = ref(props.folder)

</script>
<template>
  <folder-create-dialog
    :mpath="folder.mpath"
    :show="showCreateDialog"
    @close="showCreateDialog = false"
    @created="reload"
  />

  <li>
    <div class="w-full inline-flex flex-row justify-between items-center px-3 py-1 cursor-pointer transition-colors select-none hover:bg-base-200 rounded-btn ">
      <span class="flex flex-row items-center">
        <RiFolderLine size="16px" class="mr-1" />
        {{ folder.title }}
      </span>

      <div class="d-dropdown">
        <div tabindex="0" class="m-1 d-btn d-btn-xs bg-transparent shadow-none border-0">
          <RiMore2Line size="18px" />
        </div>

        <ul tabindex="0" class="z-[1] shadow p2 d-menu d-menu-sm d-dropdown-content bg-base-100 rounded-box w-28">
          <li>
            <a class="d-btn d-btn-ghost d-btn-squash d-btn-sm" @click="openCreateDialog">
              <RiFolderAddLine size="18px" />
              新建
            </a>
          </li>
          <li v-if="folder.code !== 'opendoc'">
            <a class="d-btn d-btn-ghost d-btn-squash d-btn-sm">
              <RiDeleteBinLine size="18px" />
              删除
            </a>
          </li>
        </ul>
      </div>
    </div>
  </li>
</template>
