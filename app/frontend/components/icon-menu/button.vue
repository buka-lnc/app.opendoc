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
  <li class="w-fit">
    <NuxtLink
      ref="button"
      :class="[
        'p-4 rounded-none',
        'hover:bg-base-300/50 active:!bg-base-300/50 focus:!bg-base-300/50 focus-visible:!bg-base-300/50',
        'hover:text-primary/70 active:!text-primary'
      ]"
      :to="to"
      active-class="!text-primary"
    >
      <cTip :show="isHover">
        {{ tip }}
      </cTip>

      <slot />
    </NuxtLink>
  </li>
</template>

<style scoped lang="postcss">
</style>
