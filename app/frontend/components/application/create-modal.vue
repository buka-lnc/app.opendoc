<script setup lang="ts">
import { createApplication } from '~/api/backend/create_application.js'

const show = defineModel<boolean>('show', {
  default: false,
})

const emit = defineEmits<{
  'created:application': [applicationId: string]
}>()

const title = ref('')
const code = ref('')

const alert = useAlert()

const { pending: creating, execute: create } = useAsyncFn(
  async () => {
    try {
      const application = await createApplication<'201'>({
        code: code.value,
        title: title.value,
      })

      show.value = false
      emit('created:application', application.id)
    } catch (e) {
      if (e instanceof Error) alert.error(e.message)
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <dialog class="d-modal" :class="show && 'd-modal-open'">
      <div class="d-modal-box font-sans !border-[#5b6078]">
        <modal-title>
          创建 Application
        </modal-title>

        <div class="flex flex-col space-y-4">
          <div class="form-control w-full max-w-md">
            <div class="d-label">
              <span class="d-label-text">名称/Title</span>
            </div>

            <input
              v-model="title"
              class="d-input d-input-bordered w-full"
            >
          </div>

          <div class="form-control w-full max-w-md">
            <div class="d-label">
              <span class="d-label-text">编码/Code</span>
              <span class="d-label-alt text-base-content/40">创建后无法修改</span>
            </div>

            <input
              v-model="code"
              class="d-input d-input-bordered w-full"
              placeholder="只允许小写字母、数字和中线"
            >
          </div>
        </div>

        <div class="d-modal-action flex-0 space-x-6">
          <button class="d-btn" @click="show = false">
            取消
          </button>

          <button
            class="d-btn d-btn-primary"
            @click="create"
          >
            <span v-if="creating" class="loading loading-spinner" />
            <span v-else>创建</span>
          </button>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped lang="postcss">
</style>
