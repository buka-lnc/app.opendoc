<script setup lang="ts">
import { Sdk } from '~/api/backend/components/schemas'

defineProps<{
  status: Sdk['status'] | undefined
}>()
</script>

<template>
  <div v-if="status === 'published'" class="d-badge d-badge-outline d-badge-success font-mono">
    SDK 已发布
  </div>

  <div v-else-if="status === 'compiling'" class="d-badge d-badge-outline d-badge-warning font-mono">
    SDK 构建中
  </div>

  <div v-else-if="status === 'pending'" class="d-badge d-badge-outline d-badge-warning font-mono">
    SDK 待构建
  </div>

  <div v-else-if="status === 'error'" class="d-badge d-badge-outline d-badge-error font-mono">
    SDK 异常
  </div>

  <div v-else class="d-badge d-badge-outline d-badge-error font-mono">
    SDK 缺失
  </div>
</template>

<style scoped lang="postcss">
</style>
