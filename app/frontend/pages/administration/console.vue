<script setup lang="ts">
import { clearStorageCache } from '~/api/backend'

const alert = useAlert()

const { pending: clearing, execute: clearCache } = useAsyncFn(async () => {
  await clearStorageCache()
  alert.success('缓存已清除')
})
</script>

<template>
  <div>
    <form-operation>
      <template #title>
        清除缓存
      </template>

      <template #description>
        清除应用、页签、文档的缓存数据
      </template>

      <basic-button
        :loading="clearing"
        @click="clearCache"
      >
        清除
      </basic-button>
    </form-operation>
  </div>
</template>

<style scoped lang="postcss">
</style>
