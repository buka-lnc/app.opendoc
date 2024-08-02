<script setup lang="ts">
import { Sdk } from '~/api/backend/components/schemas'

defineOptions({
  inheritAttrs: false,
})

defineProps<{
  status: Sdk['status'] | undefined
}>()
</script>

<template>
  <div v-if="status === 'published'" v-bind="$attrs" class="d-badge d-badge-outline d-badge-success font-mono">
    SDK 已发布
  </div>

  <div v-else-if="status === 'compiling'" v-bind="$attrs" class="d-badge d-badge-outline d-badge-warning font-mono">
    SDK 构建中
  </div>

  <div v-else-if="status === 'pending'" v-bind="$attrs" class="d-badge d-badge-outline d-badge-warning font-mono">
    SDK 待构建
  </div>

  <div v-else-if="status === 'error'" v-bind="$attrs" class="d-badge d-badge-outline d-badge-error font-mono">
    SDK 异常
  </div>

  <div v-else v-bind="$attrs" class="d-badge d-badge-outline d-badge-error font-mono">
    SDK 缺失
  </div>
</template>

<style scoped lang="postcss">
</style>
