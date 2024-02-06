<script setup lang="ts">
import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/vue'
import { SELECT_VISIBLE_INJECT_KEY } from './constants'

const { visible, toggleVisible } = inject(SELECT_VISIBLE_INJECT_KEY, {
  visible: toRef(false),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleVisible: (visible: boolean) => {},
})

defineEmits(['click'])
</script>

<template>
  <div class="flex flex-row justify-between items-center d-select bg-none" @click="toggleVisible(true)">
    <div>
      <slot />
    </div>

    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 bg-transparent"
    >
      <RiArrowUpSLine
        v-if="visible"
        class="text-gray-400"
        aria-hidden="true"
        size="1.5rem"
      />
      <RiArrowDownSLine
        v-else
        class="text-gray-400"
        aria-hidden="true"
        size="1.5rem"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
