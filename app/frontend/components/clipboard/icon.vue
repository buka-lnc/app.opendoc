<script setup lang="ts">
import { IconCopy } from '@tabler/icons-vue'
import copy from 'copy-to-clipboard'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  text: string
}>()

const alert = useAlert()
function copyToClipboard () {
  copy(props.text)
  alert.success('已复制到剪切板')
}
</script>

<template>
  <button
    v-bind="$attrs"
    class="d-btn d-btn-xs d-btn-square d-btn-ghost"
    @click="copyToClipboard"
  >
    <icon-copy class="size-4" />
  </button>
</template>

<style scoped lang="postcss">
</style>
