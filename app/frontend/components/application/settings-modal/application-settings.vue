<script setup lang="ts">
import { deleteApplication, registerApplication } from '~/api/backend'
import { Application } from '~/api/backend/components/schemas'

const props = defineProps<{
  application: Application
}>()

const emit = defineEmits<{
  'changed:application': [code: string]
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

    emit('changed:application', code)
  },
  { debounce: 500, maxWait: 1000 },
)

const router = useRouter()
const {
  pending: removing,
  error: removeError,
  execute: remove,
} = useAsyncFn(
  async () => {
    await deleteApplication({
      applicationIdOrCode: props.application.id,
    })
    await router.push('/applications')
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
        <span class="d-label-text">应用名/Title</span>
      </div>

      <input
        v-model="title"
        class="d-input d-input-bordered w-full"
      >
    </div>

    <div class="form-control w-full max-w-md">
      <div class="d-label">
        <span class="d-label-text">应用编码/Code</span>
      </div>

      <input
        :value="props.application.code"
        disabled
        class="d-input d-input-bordered w-full"
        placeholder="http/https url"
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