<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { ASYNCAPI_DOCUMENT_INJECT_KEY } from '~/constants/asyncapi-document-inject-key'

const filter = ref('')

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/asyncapi/channel`)

const asyncapiDocument = inject(ASYNCAPI_DOCUMENT_INJECT_KEY)
const channels = computed<Object>(() => asyncapiDocument?.value.channels || {})

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(asyncapiDocument),
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
        <search v-model="filter" class="d-input-xs" />
      </div>

      <ul class="flex-nowrap d-menu d-menu-sm bg-base-200 p-0 w-72 h-full">
        <li v-for="(channel, topic) in channels" :key="topic">
          <NuxtLink
            class="rounded-none w-full truncate"
            :to="{ path: `${prefix}/${topic}`, query: $route.query }"
            active-class="d-active"
          >
            {{ topic }}
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
