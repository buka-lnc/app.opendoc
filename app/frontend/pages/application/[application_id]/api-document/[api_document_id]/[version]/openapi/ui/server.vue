<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { OpenAPIV3 } from 'openapi-types'
import { OPENDOC_SERVERS_INJECT_KEY } from '~/constants/opendoc-servers-inject-key.js'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key.js'

const openapi = inject<Ref<OpenAPIV3.Document>>(SCHEMA_INJECT_KEY)

const servers = computed(() => openapi?.value.servers || [])
provide(OPENDOC_SERVERS_INJECT_KEY, { servers })

const route = useRoute()
const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/openapi/ui/server`)
const router = useRouter()
watch(
  () => toValue(servers),
  async () => {
    const results = toValue(servers)

    if (route.path === prefix.value && results.length > 0) {
      await router.replace(`${prefix.value}/0`)
    }
  },
  {
    immediate: true,
  },
)

</script>

<template>
  <div class="size-full flex items-stretch">
    <ul class="flex-0 d-menu d-menu-sm bg-base-200 overflow-hidden p-0 w-72 h-full">
      <li v-for="(server, index) in servers" :key="index">
        <NuxtLink
          class="block rounded-none p-0 w-full"
          :to="{ path: `${prefix}/${index}`, query: $route.query }"
          active-class="d-active"
        >
          <openapi-server-preview-card :server="server" />
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
