<script setup lang="ts">
// import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/vue'
import { IconChevronUp, IconChevronDown } from '@tabler/icons-vue'
import { SELECT_VISIBLE_INJECT_KEY } from './constants'

const { visible, toggleVisible } = inject(SELECT_VISIBLE_INJECT_KEY, {
  visible: toRef(false),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleVisible: (visible: boolean) => {},
})
</script>

<template>
  <div class="flex flex-row justify-between items-center d-select bg-none" @click="toggleVisible(true)">
    <div>
      <slot />
    </div>

    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 bg-transparent"
    >
      <IconChevronUp
        v-if="visible"
        class="text-gray-400 size-6"
        aria-hidden="true"
      />
      <IconChevronDown
        v-else
        class="text-gray-400 size-6"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
