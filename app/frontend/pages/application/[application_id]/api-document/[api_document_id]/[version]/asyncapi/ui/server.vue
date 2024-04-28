<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key'

const filter = ref('')

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/asyncapi/ui/server`)

const asyncapi = inject(SCHEMA_INJECT_KEY)
const servers = computed<any>(() => asyncapi?.value.servers || {})

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(asyncapi),
  async () => {
    const serverKeys = Object.keys(servers.value)
    if (route.path === prefix.value && serverKeys.length > 0) {
      await router.replace(`${prefix.value}/${serverKeys[0]}`)
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
        <li v-for="(server, serverKey) in servers" :key="serverKey">
          <NuxtLink
            class="rounded-none w-full truncate font-sans"
            :to="{ path: `${prefix}/${serverKey}`, query: $route.query }"
            active-class="d-active"
          >
            <div v-if="server.description" class="space-x-1">
              <span>{{ server.description }}</span>
              <span class="text-sm text-base-content/70">{{ serverKey }}</span>
            </div>
            <div v-else>
              <span>{{ serverKey }}</span>
            </div>
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
