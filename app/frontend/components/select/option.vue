<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'
import { SELECT_VALUE_INJECT_KEY, SELECT_VISIBLE_INJECT_KEY } from './constants'

const props = defineProps<{
  value: string | number | boolean
}>()

const selectedValue = inject(SELECT_VALUE_INJECT_KEY, toRef(''))
const selected = computed(() => props.value === selectedValue.value)

const { toggleVisible } = inject(SELECT_VISIBLE_INJECT_KEY, {
  visible: toRef(false),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleVisible: (visible: boolean) => {},
})
</script>

<template>
  <li
    class="d-join-item d-btn bg-ctp-mantle relative w-44 border-r-0 border-l-0 border-b-0 first:border-t-0 !rounded-s-none !rounded-e-none border-ctp-crust"
    @click="() => {
      toggleVisible(false)
      selectedValue = props.value
    }"
  >
    <div class="absolute top-0 left-7 w-6 h-full flex items-center">
      <IconCheck
        v-if="selected"
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
