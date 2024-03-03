<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

// const mark = ref<HTMLSpanElement | null>(null)
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

// watch(
//   () => popover.value,
//   () => {
//     const parentNode = mark.value?.parentNode
//     if (
//       !popover.value ||
//     !parentNode ||
//     !('getBoundingClientRect' in parentNode)
//     ) {
//       return
//     }

//     const rect = (parentNode as HTMLElement).getBoundingClientRect()
//     const width = popover.value.offsetWidth

//     popover.value.style.top = `${rect.top + rect.height + 4}px`
//     popover.value.style.left = `${rect.left + rect.width}px`
//   },
//   {
//     immediate: true,
//   },
// )

</script>

<template>
  <!-- 用于跟随元素 -->
  <!-- <span ref="mark" /> -->

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
        class="absolute top-0 left-0 popover bg-base-200 border border-[#5b6078] text-[#c5ceef]"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="postcss">
</style>
