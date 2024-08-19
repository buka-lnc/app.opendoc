<script setup lang="ts">
import dayjs from 'dayjs'
import { codeToHtml } from 'shiki'
import { IconFileDownload } from '@tabler/icons-vue'
import { Plugin } from '~/api/backend/components/schemas'
import { queryPluginLogs } from '~/api/backend'

const plugin = defineModel<Plugin | null>('plugin', {
  default: null,
})

const date = ref(dayjs().format('YYYY-MM-DD'))

const { data: logs } = useAsyncData(async () => {
  if (!plugin.value) return ''

  const logs = await queryPluginLogs({
    pluginId: plugin.value.id,
    date: date.value,
  })
    .resolveWith('text')

  return logs
}, {
  default: () => '',
  watch: [plugin, date],
  immediate: true,
})

const logCode = computedAsync(() => codeToHtml(logs.value, {
  lang: 'log',
  themes: {
    light: 'catppuccin-latte',
    dark: 'catppuccin-macchiato',
  },
}))

</script>

<template>
  <teleport to="body">
    <dialog
      class="d-modal overflow-y-auto"
      :class="!!plugin && 'd-modal-open'"
    >
      <div v-if="plugin" class="d-modal-box font-sans overflow-visible max-h-none h-fit w-[48rem] max-w-[48rem]">
        <modal-title>
          {{ plugin.name }} 日志
        </modal-title>

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <div class="d-form-control w-fit">
              <label class="d-label cursor-pointer">
                <span class="d-label-text pr-2">日期</span>
                <input v-model="date" type="date" class="d-input d-input-sm">
              </label>
            </div>

            <div>
              <div class="d-tooltip" data-tip="下载日志">
                <a class="d-btn d-btn-sm d-btn-square d-btn-ghost" :href="`/api/plugin/${plugin.id}/logs/${date}`" download>
                  <IconFileDownload class="size-6" />
                </a>
              </div>
            </div>
          </div>

          <div
            v-if="logs"
            class="py-2 px-4 border border-ctp-surface0 rounded-sm"
            v-html="logCode"
          />
          <empty-placeholder v-else />
        </div>

        <div class="d-modal-action">
          <button class="d-btn" @click="plugin = null">
            关闭
          </button>
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<style scoped lang="postcss">
</style>
