<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { shikiToMonaco } from '@shikijs/monaco'
import { getSingletonHighlighter } from 'shiki'

await loadShikiThemes()

monaco.languages.register({ id: 'json' })
monaco.languages.register({ id: 'markdown' })

const highlighter = await getSingletonHighlighter()
shikiToMonaco(highlighter, monaco)

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

const theme = useTheme()
const options = computed((): monaco.editor.IStandaloneEditorConstructionOptions => ({
  readOnly: true,
  theme: theme.value === 'light' ? 'catcatppuccin-latte' : 'catppuccin-macchiato',
}))

</script>
<template>
  <lazy-monaco-editor
    :lang="props.lang"
    :model-value="modalValue"
    :options="options"
  />
</template>
