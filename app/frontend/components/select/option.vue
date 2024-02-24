<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'
import { SELECT_VISIBLE_INJECT_KEY } from './constants'

const props = defineProps<{
  selected?: boolean
}>()

const { toggleVisible } = inject(SELECT_VISIBLE_INJECT_KEY, {
  visible: toRef(false),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleVisible: (visible: boolean) => {},
})
</script>

<template>
  <li
    class="d-join-item d-btn relative w-44"
    @click="toggleVisible(false)"
  >
    <div class="absolute top-0 left-7 w-6 h-full flex items-center">
      <IconCheck
        v-if="props.selected"
        class="text-primary w-6 h-6"
        aria-hidden="true"
      />
    </div>

    <div class="text-base-content ml-2">
      <slot />
    </div>
  </li>
</template>

<style scoped lang="postcss">
</style>
