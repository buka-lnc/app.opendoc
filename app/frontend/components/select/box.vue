<script setup lang="ts">
import { SELECT_VISIBLE_INJECT_KEY } from './constants'
const optionsVisible = ref(false)

function toggleOptionsVisible (visible?: boolean) {
  optionsVisible.value = visible ?? !optionsVisible.value
}

const box = ref<HTMLDivElement | null>(null)

function clickOutside (e: MouseEvent) {
  if (!(box.value && box.value.contains(e.target as any))) {
    toggleOptionsVisible(false)
  }
}

onMounted(() => {
  window.addEventListener('click', clickOutside)
})
onUnmounted(() => {
  window.removeEventListener('click', clickOutside)
})

provide(SELECT_VISIBLE_INJECT_KEY, {
  visible: optionsVisible,
  toggleVisible: toggleOptionsVisible,
})

</script>

<template>
  <div ref="box" class="relative">
    <slot
      :hide-options="() => toggleOptionsVisible(false)"
      :show-options="()=>toggleOptionsVisible(true)"
      options-visible="optionsVisible"
    />

    <transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ul
        v-if="optionsVisible"
        class="z-10 absolute mt-1 max-h-60 overflow-hidden rounded-md bg-base-100 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm d-join d-join-vertical"
      >
        <slot
          name="options"
          :hide-options="() => toggleOptionsVisible(false)"
          :show-options="() => toggleOptionsVisible(true)"
        />
      </ul>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
</style>
