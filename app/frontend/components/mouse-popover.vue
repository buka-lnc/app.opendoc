<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const popover = ref<HTMLDivElement | null>(null)

function traceMouse (e: MouseEvent) {
  if (!props.show || !popover.value) return

  const clientX = e.clientX + 12
  const clientY = e.clientY + 20

  popover.value.style.transform = `translate(${clientX}px, ${clientY}px)`
}

onMounted(() => {
  document.addEventListener('mousemove', traceMouse)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', traceMouse)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity"
      enter-from-class="opacity-0"
      enter-active-to="opacity-100"
    >
      <div
        v-show="props.show"
        v-bind="$attrs"
        ref="popover"
        class="absolute top-0 left-0 popover bg-ctp-crust ring-1 ring-ctp-surface2 text-ctp-subtext0"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="postcss">
</style>
