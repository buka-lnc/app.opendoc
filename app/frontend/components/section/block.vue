<script setup lang="ts">

</script>

<template>
  <div class="space-y-2">
    <section-title v-if="$slots.title">
      <slot name="title" />

      <template v-if="$slots.description" #description>
        <slot name="description" />
      </template>
    </section-title>

    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
