<script setup lang="ts">
import {
  RiArticleFill,
  RiBookletFill,
  RiDeleteBinLine,
  RiMore2Fill,
  RiStickyNoteAddLine,
} from '@remixicon/vue'
import { ref } from 'vue'
import { removeFolder } from '~/api/backend'
import { TreeFolder } from '~/types/tree-folder'

const props = defineProps<{
  folder: TreeFolder
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
const children = computed(() => props.folder.children)

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
        class="inline-block items-center rounded-btn hover:bg-base-200 transition-colors px-3 py-1 w-full"
        :to="`/folder/${folder.id}`"
        active-class="bg-base-200"
      >
        <div class="flex w-full h-8 items-center">
          <RiBookletFill v-if="children.length" size="1rem" class="mr-1" />
          <RiArticleFill v-else size="1rem" class="mr-1" />
          {{ folder.title }}
        </div>
      </NuxtLink>

      <div class="d-dropdown absolute top-0 right-0 h-full" @click.stop="">
        <div tabindex="0" class="d-btn d-btn-sm h-full bg-transparent shadow-none border-0">
          <RiMore2Fill size="1rem" />
        </div>

        <ul tabindex="0" class="z-[1] shadow p2 d-menu d-menu-sm d-dropdown-content bg-base-100 rounded-box w-24">
          <li>
            <a class="d-btn d-btn-ghost d-btn-squash d-btn-sm place-content-center" @click.stop="openCreateDialog">
              <RiStickyNoteAddLine size="1rem" />
              新建
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
      v-if="children.length > 0"
      :folders="children"
      @created="emit('created')"
      @deleted="emit('deleted')"
    />
  </li>
</template>
../../types/tree-folder
