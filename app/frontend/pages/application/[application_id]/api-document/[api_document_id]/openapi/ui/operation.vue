<script setup lang="ts">
import { OPENDOC_OPERATIONS_INJECT_KEY } from '~/constants/opendoc-operations-inject-key'

const { operations } = inject(OPENDOC_OPERATIONS_INJECT_KEY, { operations: [] })

const route = useRoute()
const prefix = computed(() => `/application/${String(route.params.application_id)}/api-document/${String(route.params.api_document_id)}/openapi/ui/operation`)

const router = useRouter()
watch(
  () => toValue(operations),
  async () => {
    const ops = toValue(operations)

    if (route.path === prefix.value && ops.length > 0) {
      await router.replace(`${prefix.value}/${ops[0].id}`)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="size-full flex items-stretch">
    <ul class="bg-base-200 flex-0 d-menu d-menu-sm bg-base-200 overflow-hidden p-0 w-fit h-full">
      <li v-for="operation in operations" :key="operation.id">
        <NuxtLink
          class="gap-0 rounded-none p-0"
          :to="`${prefix}/${operation.id}`"
          active-class="d-active"
        >
          <OperationPreviewCard :operation="operation" />
        </NuxtLink>
      </li>
    </ul>

    <div class="flex-1 bg-base-300">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
