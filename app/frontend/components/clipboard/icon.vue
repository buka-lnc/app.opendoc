<script setup lang="ts">
import { IconCopy } from '@tabler/icons-vue'
import copy from 'copy-to-clipboard'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  text: string
}>()

const [alertVisible, toggleAlertVisible] = useToggle(false)

function copyToClipboard () {
  copy(props.text)
  toggleAlertVisible(true)
  delayCloseAlert()
}

const { start: delayCloseAlert } = useTimeoutFn(() => {
  toggleAlertVisible(false)
}, 2000)
</script>

<template>
  <alert-success :show="alertVisible">
    已复制到剪切板
  </alert-success>

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
