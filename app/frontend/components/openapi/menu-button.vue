<script setup lang="ts">
import { useElementHover } from '@vueuse/core'
import cTip from '~/components/tip.vue'

defineProps<{
  to: string
  tip: string
}>()

const button = ref()
const isHover = useElementHover(button)
</script>

<template>
  <NuxtLink
    ref="button"
    :class="[
      'p-4 rounded-none',
      'hover:bg-base-100 active:!bg-base-100 focus:!bg-base-100 focus-visible:!bg-base-100',
      'hover:text-primary/70 active:!text-primary focus:text-primary focus-visible:text-primary'
    ]"
    :to="to"
    active-class="text-primary"
  >
    <cTip :show="isHover">
      {{ tip }}
    </cTip>

    <slot />
  </NuxtLink>
</template>

<style scoped lang="postcss">
</style>
