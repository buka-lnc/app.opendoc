<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'

defineProps <{
  server: OpenAPIV3.ServerObject
}>()
</script>

<template>
  <div class="px-2 pb-1 pt-2">
    <div class="flex-auto flex flex-col justify-center items-start h-full overflow-hidden">
      <span
        class="leading-4 max-w-full truncate font-sans"
      >
        {{ server.url }}
      </span>
      <span
        class="text-xs leading-4 opacity-70 max-w-full truncate"
      >
        {{ server.description }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
