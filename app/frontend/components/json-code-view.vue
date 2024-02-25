<script setup lang="ts">
import * as monaco from 'monaco-editor'

const props = defineProps<{
  value: string
  theme: string
}>()

const modalValue = computed(() => {
  try {
    return JSON.stringify(JSON.parse(props.value), null, 2)
  } catch (e) {
    return props.value
  }
})

const options: monaco.editor.IEditorConstructionOptions = {
  readOnly: true,
}

</script>
<template>
  <lazy-monaco-editor
    lang="json"
    :model-value="modalValue"
    :options="options"
    :theme="props.theme"
  />
</template>
