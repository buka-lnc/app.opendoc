<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  show: boolean
  error?: boolean
}>()

const mark = ref<HTMLSpanElement | null>(null)
const tip = ref<HTMLDivElement | null>(null)

watch(
  () => tip.value,
  () => {
    const parentNode = mark.value?.parentNode
    if (
      !tip.value ||
    !parentNode ||
    !('getBoundingClientRect' in parentNode)
    ) {
      return
    }

    const rect = (parentNode as HTMLElement).getBoundingClientRect()
    // const width = tip.value.offsetWidth
    const height = tip.value.offsetHeight

    tip.value.style.top = `${rect.top + rect.height / 2 - height / 2}px`
    tip.value.style.left = `${rect.left + rect.width + 4}px`
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <!-- 用于跟随元素 -->
  <span ref="mark" class="hidden" />

  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity"
      enter-from-class="opacity-0"
      enter-active-to="opacity-100"
    >
      <div
        v-if="show"
        v-bind="$attrs"
        ref="tip"
        :class="[
          'font-sans absolute drop-shadow-sm top-0 left-0',
          'tip', { error: props.error }
        ]"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="postcss">

.tip {
  --bg-color: rgb(var(--ctp-crust));
  --ft-color: var(--bc);

  &.error {
    --bg-color: var(--fallback-er, oklch(var(--er)));
    --ft-color: var(--fallback-erc, oklch(var(--erc)));
  }

  max-width: 20rem;
  border-radius: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: var(--bg-color);
  color: var(--ft-color);

  &::before {
    position: absolute;
    display: block;
    content: "";

    border-style: solid;
    border-width: 0.1875rem;
    border-color: transparent var(--bg-color) transparent transparent;

    width: 0;
    height: 0;

    top: 50%;
    transform: translateY(-50%);
    right: 100%;
  }
}

</style>
