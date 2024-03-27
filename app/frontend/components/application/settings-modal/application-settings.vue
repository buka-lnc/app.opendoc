<script setup lang="ts">
import { registerApplication } from '~/api/backend'
import { Application } from '~/api/backend/components/schemas'

const props = defineProps<{
  application: Application
}>()

const emit = defineEmits<{
  'changed:application': [code: string]
}>()

const title = ref(props.application.title)

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
</script>

<template>
  <div class="flex flex-col space-y-4">
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
        placeholder="大小写字母、下划线或中线"
      >
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
