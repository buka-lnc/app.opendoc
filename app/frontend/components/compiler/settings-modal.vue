<script setup lang="ts">
import * as R from 'ramda'
import { Compiler } from '~/api/backend/components/schemas'
import { updateCompiler } from '~/api/backend'

const compiler = defineModel<Compiler | null>('compiler', {
  default: null,
})

const emit = defineEmits<{
  'updated:compiler': [id: string]
}>()

const editingCompiler = ref<Compiler | null>()
syncRef(
  editingCompiler,
  compiler,
  {
    direction: 'rtl',
    transform: { rtl: R.clone },
  },
)

const { execute: save, pending: saving } = useAsyncFn(async () => {
  if (!editingCompiler.value) return

  await updateCompiler({
    compilerId: editingCompiler.value.id,
    options: editingCompiler.value.options,
  })
  compiler.value = null

  emit('updated:compiler', editingCompiler.value.id)
})
</script>

<template>
  <teleport to="body">
    <dialog
      class="d-modal"
      :class="!!editingCompiler && 'd-modal-open'"
    >
      <div v-if="editingCompiler" class="d-modal-box font-sans">
        <h3 class="text-lg font-bold pb-6">
          {{ editingCompiler.name }}
        </h3>

        <div class="space-y-3">
          <label>
            <div class="d-label">
              <span class="d-label-text">版本</span>
            </div>

            <input
              type="string"
              disabled
              class="d-input d-input-bordered w-full max-w-sm"
              :value="editingCompiler.version"
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
              :value="editingCompiler.url"
            >
          </label>

          <compiler-option v-for="opt of editingCompiler.options" :key="opt.id" :option="opt" />
        </div>

        <div class="d-modal-action">
          <button
            class="d-btn d-btn-success"
            @click="save"
          >
            <span v-if="saving" class="d-loading d-loading-spinner" />
            保存
          </button>

          <button class="d-btn" @click="compiler = null">
            取消
          </button>
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<style scoped lang="postcss">
</style>
