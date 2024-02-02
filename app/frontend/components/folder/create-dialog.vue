<script setup lang="ts">
import { registerFolder } from '~/api/backend'

const props = defineProps<{
  mpath: string
  show: boolean
}>()

const emit = defineEmits(['close', 'created'])

const code = ref('')

const { execute, isLoading } = useAsyncState(
  async () => {
    await registerFolder({ mpath: `${props.mpath}${code.value}` })
    code.value = ''
    emit('created')
  },
  undefined,
  {
    immediate: false,
  },
)

</script>
<template>
  <teleport to="body">
    <dialog class="d-modal" :class="{ 'd-modal-open': props.show }">
      <div class="d-modal-box">
        <h3 class="font-bold text-lg">
          创建文档
        </h3>

        <div class="mt-6 mx-3">
          <label class="d-label">
            <label-text class="w-20" tip="文档同层级唯一的标识符">
              编码
            </label-text>

            <input
              v-model="code"
              type="text"
              placeholder="英文字母/数字/下划线"
              class="d-input d-input-bordered w-full"
            >
          </label>
        </div>

        <div class="d-modal-action mx-3">
          <form method="dialog" class="flex space-x-3">
            <button class="d-btn" :disabled="isLoading" @click="$emit('close')">
              取消
            </button>

            <button class="d-btn d-btn-primary" @click="execute()">
              <span v-if="isLoading" class="loading loading-spinner" />

              创建
            </button>
          </form>
        </div>
      </div>

      <label class="d-modal-backdrop" @click="$emit('close')" />
    </dialog>
  </teleport>
</template>
