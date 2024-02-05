<script setup lang="ts">
import {
  RiBookletFill,
  RiBookReadFill,
  RiDeleteBinLine,
  RiMore2Fill,
  RiFileAddLine,
  RiFileEditLine,
} from '@remixicon/vue'
import { ref } from 'vue'
import { removeFolder } from '~/api/backend'
import { ParsedFolder } from '~/types/parsed-folder'

const props = defineProps<{
  folders: ParsedFolder[]
  folder: ParsedFolder
  activeFolderId?: string
}>()

const emit = defineEmits(['created', 'deleted'])

const showCreateDialog = ref(false)
function openCreateDialog () {
  showCreateDialog.value = true
  const el = document.activeElement as HTMLElement
  if (el) el.blur()
}
function closeCreateDialogAndEmitEvent (): void {
  showCreateDialog.value = false
  emit('created')
}

const { isLoading: isDeleting, execute: deleteFolder } = useAsyncState(
  async () => {
    await removeFolder({
      folderIdOrMpath: props.folder.id,
    })

    const el = document.activeElement as HTMLElement
    if (el) el.blur()

    emit('deleted')
  },
  undefined,
  {
    immediate: false,
  },
)

const folder = ref(props.folder)
const hasChildren = computed(() => props.folders.some(folder => folder.mpath.startsWith(props.folder.mpath) && folder.mpaths.length === props.folder.mpaths.length + 1))

const isAncestorOfActiveFolder = computed(() => {
  if (!props.activeFolderId) return false

  const activeFolder = props.folders.find(folder => folder.id === props.activeFolderId)
  console.log('🚀 ~ isAncestorOfActiveFolder ~ activeFolder:', activeFolder)
  if (!activeFolder) return false

  return props.folder.mpath.startsWith(activeFolder.mpath)
})

</script>
<template>
  <folder-create-dialog
    :mpath="folder.mpath"
    :show="showCreateDialog"
    @close="showCreateDialog = false"
    @created="closeCreateDialogAndEmitEvent"
  />

  <li>
    <div
      class="w-full relative"
    >
      <NuxtLink
        class="inline-block items-center rounded-btn hover:bg-base-300 transition-colors px-3 py-1 w-full"
        :to="`/folder/${folder.id}`"
        active-class="bg-base-300"
      >
        <div class="flex w-full h-8 items-center">
          <RiBookReadFill v-if="isAncestorOfActiveFolder" size="1rem" />
          <RiBookletFill v-else size="1rem" />
          <span class="truncate ml-1">
            {{ folder.title }}
          </span>
        </div>
      </NuxtLink>

      <div class="d-dropdown absolute top-0 right-0 h-full" @click.stop="">
        <div tabindex="0" class="d-btn d-btn-sm h-full bg-transparent shadow-none border-0">
          <RiMore2Fill size="1rem" />
        </div>

        <ul tabindex="0" class="z-[1] shadow p2 d-menu d-menu-sm d-dropdown-content bg-base-100 rounded-box w-24">
          <li>
            <a class="d-btn d-btn-ghost d-btn-squash d-btn-sm place-content-center" @click.stop="openCreateDialog">
              <RiFileAddLine size="1rem" />
              新建
            </a>
          </li>

          <li>
            <a class="d-btn d-btn-ghost d-btn-squash d-btn-sm place-content-center" @click.stop="openCreateDialog">
              <RiFileEditLine size="1rem" />
              编辑
            </a>
          </li>

          <li v-if="folder.code !== 'opendoc'">
            <a class="d-btn d-btn-ghost d-btn-squash d-btn-sm  place-content-center" @click.stop="deleteFolder()">
              <span v-if="isDeleting" class="d-loading d-loading-spinner d-loading-xs" />

              <RiDeleteBinLine v-if="!isDeleting" size="1rem" />
              删除
            </a>
          </li>
        </ul>
      </div>
    </div>

    <folder-tree
      v-if="hasChildren"
      :folders="folders"
      :mpath="folder.mpath"
      :active-folder-id="props.activeFolderId"
      @created="emit('created')"
      @deleted="emit('deleted')"
    />
  </li>
</template>
