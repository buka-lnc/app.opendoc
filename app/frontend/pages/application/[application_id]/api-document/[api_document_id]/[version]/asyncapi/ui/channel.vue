<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key'

const filter = ref('')

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/asyncapi/ui/channel`)

const asyncapi = inject(SCHEMA_INJECT_KEY)
const channels = computed<Object>(() => asyncapi?.value.channels || {})

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(asyncapi),
  async () => {
    const topics = Object.keys(channels.value)
    if (route.path === prefix.value && topics.length > 0) {
      await router.replace(`${prefix.value}/${topics[0]}`)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="size-full flex items-stretch">
    <div class="bg-base-200 flex-0 overflow-y-auto overflow-x-hidden h-full">
      <div class="p-2">
        <search v-model="filter" />
      </div>

      <ul class="flex-nowrap d-menu d-menu-sm bg-base-200 p-0 w-72 h-full">
        <li v-for="(channel, topic) in channels" :key="topic">
          <NuxtLink
            class="rounded-none w-full truncate"
            :to="{ path: `${prefix}/${topic}`, query: $route.query }"
            active-class="d-active"
          >
            {{ topic }}
            <!-- <OpenapiOperationPreviewCard :operation="operation" /> -->
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="flex-1 bg-base-300">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
