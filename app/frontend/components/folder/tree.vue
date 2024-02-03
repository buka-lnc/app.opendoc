<script setup lang="ts">
import { TreeFolder } from '~/types/tree-folder'

const props = defineProps<{
  folders: TreeFolder[]
}>()

const emit = defineEmits(['created', 'deleted'])
</script>

<template>
  <ul class="menu text-sm text-base-content">
    <folder-item
      v-for="folder in props.folders"
      :key="folder.id"
      :folder="folder"
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
