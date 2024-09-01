<script setup lang="ts">
import { syncApiDocument, deleteSheet, updateSheet } from '~/api/backend'
import { Application, Sheet, SheetPullCrontabDTO } from '~/api/backend/components/schemas'
import { SheetModeDescription } from '~/constants/sheet-mode-description'
import { SheetTypeDescription } from '~/constants/sheet-type-description'

const props = defineProps<{
  application: Application
  sheet: Sheet
}>()
const emit = defineEmits<{
  'updated:sheet': [code: string]
  'deleted:sheet': [code: string]
}>()

const sheet = toRef(props, 'sheet')

const code = toRef(() => sheet.value.code)
const title = ref('')
syncRef(title, toRef(() => sheet.value.title), { direction: 'rtl' })
const pullCrontabUrl = ref('')
syncRef(
  pullCrontabUrl,
  toRef(() => sheet.value.pullCrontab?.url || ''),
  {
    direction: 'rtl',
    transform: { rtl: r => r || '' },
  },
)
const mode = ref<Sheet['mode']>('push')
syncRef(mode, toRef(() => sheet.value.mode), { direction: 'rtl' })
const type = ref<Sheet['type']>('openapi')
syncRef(type, toRef(() => sheet.value.type), { direction: 'rtl' })

watchDebounced(
  [title, pullCrontabUrl],
  async () => {
    let pullCrontab: SheetPullCrontabDTO | undefined
    if (mode.value === 'pull' && pullCrontabUrl.value) {
      pullCrontab = {
        url: pullCrontabUrl.value,
      }
    }

    if (mode.value) {
      await updateSheet({
        sheetId: sheet.value.id,
        type: type.value,
        title: title.value,
        mode: mode.value,
        pullCrontab,
      })
    }

    emit('updated:sheet', code.value)
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
      await deleteSheet({
        sheetId: sheet.value.id,
      })
      emit('deleted:sheet', sheet.value.id)
    }
    catch (err) {
      if (err instanceof Error) {
        alert.error(err.message, 10000000)
      }
      else {
        console.error(err)
        throw err
      }
    }
  },
)

const {
  pending: synchronizing,
  execute: synchronize,
} = useAsyncFn(
  async () => {
    try {
      console.log(sheet.value)
      await syncApiDocument({
        sheetId: sheet.value.id,
      })
    }
    catch (err) {
      if (err instanceof Error) {
        alert.error(err.message, 10000000)
      }
      else {
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
          {{ SheetTypeDescription[type] }}
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
        class="d-input d-input-bordered w-full"
        :disabled="mode !== 'pull'"
        placeholder="大小写字母、下划线或中线"
      >
    </div>
  </div>

  <form-operation
    v-if="mode === 'pull' && pullCrontabUrl"
    class="max-w-md"
  >
    <template #title>
      同步文档
    </template>
    <template #description>
      同步会立刻生成一个新版本
    </template>

    <basic-button
      :loading="synchronizing"
      @click="synchronize"
    >
      同步
    </basic-button>
  </form-operation>

  <form-operation class="max-w-md">
    <template #title>
      删除文档
    </template>
    <template #description>
      一旦删除，应用将无法恢复，请慎重操作。
    </template>

    <basic-button
      class="d-btn-error"
      :loading="removing"
      @click="remove"
    >
      删除
    </basic-button>
  </form-operation>
</template>

<style scoped lang="postcss">
</style>
~/constants/sheet-mode-description
