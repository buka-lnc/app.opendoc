<script setup lang="ts">
import { deleteApplication, registerApplication } from '~/api/backend'
import { Application } from '~/api/backend/components/schemas'

const props = defineProps<{
  application: Application
}>()

const emit = defineEmits<{
  'updated:application': [code: string]
}>()

const title = ref('')
syncRef(title, toRef(() => props.application.title), { direction: 'rtl' })

watchDebounced(
  [title],
  async () => {
    if (!title.value) return

    const code = props.application.code
    await registerApplication({
      code,
      title: title.value,
    })

    emit('updated:application', code)
  },
  { debounce: 500, maxWait: 1000 },
)

const alert = useAlert()
const router = useRouter()
const {
  pending: removing,
  execute: remove,
} = useAsyncFn(
  async () => {
    try {
      await deleteApplication({
        applicationIdOrCode: props.application.id,
      })
      await router.push('/applications')
    }
    catch (err) {
      if (err instanceof Error) {
        alert.error(err.message)
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
      </div>

      <input
        :value="props.application.code"
        disabled
        class="d-input d-input-bordered w-full"
        placeholder="http/https url"
      >
    </div>
  </div>

  <form-operation class="max-w-md">
    <template #title>
      删除应用
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
