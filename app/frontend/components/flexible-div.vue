<script setup lang="ts">
const container = ref()
const content = ref()
const contentSize = useElementSize(content)
watchEffect(() => {
  if (!container.value || !contentSize.height.value) return
  container.value.style.height = `${contentSize.height.value}px`
})
</script>

<template>
  <div
    ref="container"
    class="block transition-[height] overflow-hidden"
  >
    <div ref="content" class="overflow-hidden">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
