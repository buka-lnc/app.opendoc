<script setup lang="ts">
import { ParsedFolder } from '~/types/parsed-folder'

const props = defineProps<{
  folders: ParsedFolder[]
  mpath?: string
  activeFolderId?: string
}>()

const children = computed(() => props.folders.filter(folder => (
  folder.mpath.startsWith(props.mpath || '') &&
    folder.mpaths.length === (props.mpath?.length || 0) + 1
)))

const emit = defineEmits(['created', 'deleted'])
</script>

<template>
  <ul class="menu text-sm text-base-content">
    <folder-item
      v-for="folder in children"
      :key="folder.id"
      :folders="folders"
      :folder="folder"
      :active-folder-id="$props.activeFolderId"
      @created="emit('created')"
      @deleted="emit('deleted')"
    />
  </ul>
</template>
<style lang="postcss" scoped>
.menu > li > ul {
  margin-inline-start: 1rem;
  padding-inline-start: 0.5rem;
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0.75rem;
    bottom: 0.75rem;
    inset-inline-start: 0;
    width: 1px;
    opacity: .1;
    --tw-bg-opacity: 1;
    background-color: var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)));
  }
}

</style>
