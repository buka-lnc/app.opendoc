<script setup lang="ts">
import { IconCircleCheck } from '@tabler/icons-vue'

defineProps<{
  show: boolean
}>()

</script>

<template>
  <teleport to="body">
    <div class="z-50 absolute top-0 left-0 px-10 py-2 w-full flex items-center justify-around">
      <transition
        enter-active-class="transition-all duration-75 ease-out"
        enter-from-class="transform -translate-y-full opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition-all duration-75 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-full opacity-00"
      >
        <div
          v-if="show"
          role="alert"
          class="d-alert d-alert-success w-fit"
        >
          <IconCircleCheck class="size-5 text-green-950" />
          <span class="text-green-950">
            <slot />
          </span>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<style scoped lang="postcss">
</style>
