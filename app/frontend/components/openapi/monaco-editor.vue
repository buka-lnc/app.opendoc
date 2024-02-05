<script setup lang="ts">
import * as monaco from 'monaco-editor'

const props = defineProps<{
  modalValue: string
  lang: string
  theme: string
  options?: monaco.editor.IEditorConstructionOptions
}>()

const modalValue = computed(() => {
  try {
    return JSON.stringify(JSON.parse(props.modalValue), null, 2)
  } catch (e) {
    return props.modalValue
  }
})

onMounted(() => {
  // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  //   validate: true,
  //   schemas: [
  //     {
  //       uri: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.1/schema.json',
  //       schema: {
  //         $ref: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.1/schema.json',
  //       },
  //     },
  //   ],
  // })
})

</script>
<template>
  <monaco-editor
    v-bind="props"
    :model-value="modalValue"
  />
</template>
