<script setup lang="ts">
import { request } from 'keq'
import { deleteApiDocument } from '~/api/backend'
import { ApiDocument, Application } from '~/api/backend/components/schemas'
import { ApiDocumentModeDescription } from '~/constants/api-document-mode-description'
import { ApiDocumentTypeDescription } from '~/constants/api-document-type-description'

const props = defineProps<{
  application: Application
  apiDocument: ApiDocument
}>()
const emit = defineEmits<{
  'changed:apiDocument': [code: string]
  'deleted:apiDocument': [code: string]
}>()

const code = toRef(() => props.apiDocument.code)
const title = ref('')
syncRef(title, toRef(() => props.apiDocument.title), { direction: 'rtl' })
const cronSyncUrl = ref('')
syncRef(
  cronSyncUrl,
  toRef(() => props.apiDocument.cronSyncUrl),
  {
    direction: 'rtl',
    transform: { rtl: r => r || '' },
  },
)
const mode = ref<ApiDocument['mode']>('push')
syncRef(mode, toRef(() => props.apiDocument.mode), { direction: 'rtl' })
const type = ref<ApiDocument['type']>('openapi')
syncRef(type, toRef(() => props.apiDocument.type), { direction: 'rtl' })

watchDebounced(
  [title, cronSyncUrl],
  async () => {
    const req = request
      .put('/api/api-document')
      .field('applicationCode', props.application.code)
      .field('apiDocumentType', type.value)
      .field('apiDocumentCode', code.value)
      .field('apiDocumentTitle', title.value || code.value)
      .field('apiDocumentMode', mode.value)

    if (mode.value === 'pull') {
      void req.field('apiDocumentCronSyncUrl', cronSyncUrl.value)
    }

    await req.end()

    emit('changed:apiDocument', code.value)
  },
  { debounce: 500, maxWait: 1000 },
)

const alert = useAlert()
const {
  pending: removing,
  execute: remove,
} = useAsyncFn(
  async () => {
    try {
      await deleteApiDocument({
        apiDocumentId: props.apiDocument.id,
      })
      emit('deleted:apiDocument', props.apiDocument.id)
    } catch (err) {
      if (err instanceof Error) {
        alert.error(err.message, 10000000)
      } else {
        console.error(err)
        throw err
      }
    }
  },
)
</script>

<template>
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
            OpenAPI
          </SelectOption>
          <SelectOption value="asyncapi">
            AsyncAPI
          </SelectOption>
          <SelectOption value="markdown">
            Markdown
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
      </div>

      <input
        :value="code"
        disabled
        class="d-input d-input-bordered w-full"
        placeholder="大小写字母、下划线或中线"
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
        class="d-input d-input-bordered w-full"
        :disabled="mode !== 'pull'"
        placeholder="大小写字母、下划线或中线"
      >
    </div>
  </div>

  <danger-operation
    :pending="removing"
    @click="remove"
  >
    <template #title>
      删除文档
    </template>
    <template #description>
      一旦删除，应用将无法恢复，请慎重操作。
    </template>

    删除
  </danger-operation>
</template>

<style scoped lang="postcss">
</style>
