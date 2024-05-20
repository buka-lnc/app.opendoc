<script setup lang="ts">
import * as monaco from 'monaco-editor'

const props = defineProps<{
  lang: string
  content: string

  format?: boolean
}>()

const modalValue = computed(() => {
  const { format, lang, content } = props
  if (!format) return content

  try {
    if (lang === 'json') {
      return JSON.stringify(JSON.parse(content), null, 2)
    }

    return content
  } catch (e) {
    return content
  }
})

const options: monaco.editor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
  theme: 'vs-dark',
}

</script>
<template>
  <lazy-monaco-editor
    lang="json"
    :model-value="modalValue"
    :options="options"
  />
</template>
