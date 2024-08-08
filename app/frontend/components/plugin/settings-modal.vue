<script setup lang="ts">
import * as R from 'ramda'
import { Plugin } from '~/api/backend/components/schemas'
import { updatePlugin } from '~/api/backend'

const plugin = defineModel<Plugin | null>('plugin', {
  default: null,
})

const emit = defineEmits<{
  'updated:plugin': [id: string]
}>()

const editingPlugin = ref<Plugin | null>()
syncRef(
  editingPlugin,
  plugin,
  {
    direction: 'rtl',
    transform: { rtl: R.clone },
  },
)

const { execute: save, pending: saving } = useAsyncFn(async () => {
  if (!editingPlugin.value) return

  await updatePlugin({
    pluginId: editingPlugin.value.id,
    options: editingPlugin.value.options,
  })
  plugin.value = null

  emit('updated:plugin', editingPlugin.value.id)
})
</script>

<template>
  <teleport to="body">
    <dialog
      class="d-modal"
      :class="!!editingPlugin && 'd-modal-open'"
    >
      <div v-if="editingPlugin" class="d-modal-box font-sans">
        <modal-title>
          {{ editingPlugin.name }}
        </modal-title>

        <div class="space-y-3">
          <label>
            <div class="d-label">
              <span class="d-label-text">版本</span>
            </div>

            <input
              type="string"
              disabled
              class="d-input d-input-bordered w-full max-w-sm"
              :value="editingPlugin.version"
            >
          </label>

          <label>
            <div class="d-label">
              <span class="d-label-text">地址</span>
            </div>

            <input
              type="string"
              disabled
              class="d-input d-input-bordered w-full max-w-sm"
              :value="editingPlugin.url"
            >
          </label>

          <plugin-option
            v-for="opt of editingPlugin.options"
            :key="opt.id"
            :option="opt"
          />
        </div>

        <div class="d-modal-action">
          <button
            class="d-btn d-btn-success"
            @click="save"
          >
            <span v-if="saving" class="d-loading d-loading-spinner" />
            保存
          </button>

          <button class="d-btn" @click="plugin = null">
            取消
          </button>
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<style scoped lang="postcss">
</style>
