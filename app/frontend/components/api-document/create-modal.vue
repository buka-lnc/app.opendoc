<script setup lang="ts">
import { createApiDocument } from '~/api/backend'
import { ApiDocument, Application } from '~/api/backend/components/schemas'
import { ApiDocumentTypeDescription } from '~/constants/api-document-type-description'
import { ApiDocumentModeDescription } from '~/constants/api-document-mode-description'

const props = defineProps<{
  application: Application
}>()

const emit = defineEmits<{
  'created:apiDocument': [code: string]
}>()

const title = ref('')
const code = ref('')
const type = ref<ApiDocument['type']>('openapi')
const mode = ref<ApiDocument['mode']>('push')
const cronSyncUrl = ref('')

const show = defineModel<boolean>('show')

async function create (): Promise<void> {
  await createApiDocument({
    applicationCode: props.application.code,
    apiDocumentTitle: title.value,
    apiDocumentCode: code.value,
    apiDocumentCronSyncUrl: mode.value === 'pull' ? cronSyncUrl.value : undefined,
    apiDocumentMode: mode.value,
    apiDocumentType: type.value,
  })

  show.value = false
  emit('created:apiDocument', code.value)

  type.value = 'openapi'
  code.value = ''
  title.value = ''
  cronSyncUrl.value = ''
}
</script>

<template>
  <Teleport to="body">
    <div class="d-modal" :class="show && 'd-modal-open'">
      <div class="d-modal-box">
        <h3 class="font-bold text-lg">
          创建文档
        </h3>

        <div class="flex flex-col space-y-4">
          <div class="form-control w-full max-w-md">
            <div class="d-label">
              <span class="d-label-text">类型/Type</span>
            </div>

            <SelectBox v-model="type">
              <SelectButton
                class="d-join-item d-select-bordered"
              >
                {{ ApiDocumentTypeDescription[type] }}
              </SelectButton>

              <template #options>
                <SelectOption value="openapi">
                  {{ ApiDocumentTypeDescription.openapi }}
                </SelectOption>
                <SelectOption value="asyncapi">
                  {{ ApiDocumentTypeDescription.asyncapi }}
                </SelectOption>
                <SelectOption value="markdown">
                  {{ ApiDocumentTypeDescription.markdown }}
                </SelectOption>
              </template>
            </SelectBox>
          </div>

          <div class="form-control w-full max-w-md">
            <div class="d-label">
              <span class="d-label-text">文档名/Title</span>
            </div>

            <input
              v-model="title"
              class="d-input d-input-bordered w-full"
            >
          </div>

          <div class="form-control w-full max-w-md">
            <div class="d-label">
              <span class="d-label-text">文档编码/Code</span>
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
                {{ ApiDocumentModeDescription[mode] }}
              </SelectButton>

              <template #options>
                <SelectOption value="pull">
                  {{ ApiDocumentModeDescription.pull }}
                </SelectOption>
                <SelectOption value="push">
                  {{ ApiDocumentModeDescription.push }}
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
              v-model="cronSyncUrl"
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
            创建
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="postcss">
</style>
