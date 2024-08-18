<script setup lang="ts">
import { Application, Sheet } from '~/api/backend/components/schemas'
import { SheetTypeDescription } from '~/constants/sheet-type-description'
import { SheetModeDescription } from '~/constants/sheet-mode-description'
import { createSheet } from '~/api/backend'

const props = defineProps<{
  application: Application
}>()

const emit = defineEmits<{
  'created:sheet': [code: string]
}>()

const title = ref('')
const code = ref('')
const type = ref<Sheet['type']>('openapi')
const mode = ref<Sheet['mode']>('push')
const pullCrontabUrl = ref('')

const show = defineModel<boolean>('show')

const alert = useAlert()
const { pending, execute: create } = useAsyncFn(async function (): Promise<void> {
  try {
    await createSheet({
      application: {
        id: props.application.id,
      },
      title: title.value,
      code: code.value,
      type: type.value,
      mode: mode.value,
      pullCrontab: mode.value === 'pull' ? { url: pullCrontabUrl.value } : undefined,
    })
  } catch (err) {
    if (err instanceof Error) {
      alert.error(err.message)
    }

    console.error(err)
    throw err
  }

  show.value = false
  emit('created:sheet', code.value)

  type.value = 'openapi'
  code.value = ''
  title.value = ''
  pullCrontabUrl.value = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="d-modal" :class="show && 'd-modal-open'">
      <div class="d-modal-box">
        <modal-title>
          创建 Sheet
        </modal-title>

        <div class="flex flex-col space-y-4">
          <div class="form-control w-full max-w-md">
            <div class="d-label">
              <span class="d-label-text">类型/Type</span>
            </div>

            <SelectBox v-model="type">
              <SelectButton
                class="d-join-item d-select-bordered"
              >
                {{ SheetTypeDescription[type] }}
              </SelectButton>

              <template #options>
                <SelectOption value="openapi">
                  {{ SheetTypeDescription.openapi }}
                </SelectOption>
                <SelectOption value="asyncapi">
                  {{ SheetTypeDescription.asyncapi }}
                </SelectOption>
                <SelectOption value="markdown">
                  {{ SheetTypeDescription.markdown }}
                </SelectOption>
              </template>
            </SelectBox>
          </div>

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

          <div class="form-control w-full max-w-md">
            <div class="d-label">
              <span class="d-label-text">同步模式/Mode</span>
            </div>

            <SelectBox v-model="mode">
              <SelectButton
                class="d-join-item d-select-bordered"
              >
                {{ SheetModeDescription[mode] }}
              </SelectButton>

              <template #options>
                <SelectOption value="pull">
                  {{ SheetModeDescription.pull }}
                </SelectOption>
                <SelectOption value="push">
                  {{ SheetModeDescription.push }}
                </SelectOption>
              </template>
            </SelectBox>
          </div>

          <div class="form-control w-full max-w-md">
            <div class="d-label">
              <span
                class="d-label-text"
                :class="mode !== 'pull' && 'text-base-content/40'"
              >同步地址</span>
            </div>

            <input
              v-model="pullCrontabUrl"
              :disabled="mode !== 'pull'"
              class="d-input d-input-bordered w-full"
              placeholder="http/https url"
            >
          </div>
        </div>

        <div class="d-modal-action flex-0 space-x-6">
          <button class="d-btn" @click="show = false">
            取消
          </button>

          <button class="d-btn d-btn-primary" @click="create">
            <span v-if="pending" class="d-loading d-loading-spinner" />

            创建
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="postcss">
</style>
~/constants/sheet-mode-description
~/constants/sheet-type-description
