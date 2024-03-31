<script setup lang="ts">
import { deleteApiDocument } from '~/api/backend'
import { ApiDocument } from '~/api/backend/components/schemas'
import { ApiDocumentTypeDescription } from '~/constants/api-document-type-description'

const props = defineProps<{
  apiDocument: ApiDocument
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
const type = ref<ApiDocument['type']>('openapi')
syncRef(type, toRef(() => props.apiDocument.type), { direction: 'rtl' })

watch(
  () => props.apiDocument.id,
  () => {
    title.value = props.apiDocument.title
  },
)

const {
  pending: removing,
  error: removeError,
  execute: remove,
} = useAsyncFn(
  async () => {
    await deleteApiDocument({
      apiDocumentId: props.apiDocument.id,
    })
  },
)
const [alertVisible, toggleAlertVisible] = useToggle(false)
const { start: delayCloseAlert } = useTimeoutFn(() => {
  toggleAlertVisible(false)
}, 10000)
watchEffect(() => {
  if (!removeError.value) return
  alertVisible.value = true
  delayCloseAlert()
})
</script>

<template>
  <div class="flex flex-col space-y-4">
    <alert-error
      v-model:show="alertVisible"
    >
      {{ removeError?.message }}
    </alert-error>

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
        <span class="d-label-text">同步地址</span>
      </div>

      <input
        :value="cronSyncUrl"
        class="d-input d-input-bordered w-full"
        placeholder="大小写字母、下划线或中线"
      >
    </div>
  </div>

  <danger-operation
    :pending="removing"
    @click="remove"
  >
    <template #title>
      删除应用
    </template>
    <template #description>
      一旦删除，应用将无法恢复，请慎重操作。
    </template>

    删除
  </danger-operation>
</template>

<style scoped lang="postcss">
</style>
