<script setup lang="ts">
import type { OpenAPIV3 } from 'openapi-types'
import { IconVersions, IconApi, IconSchema, IconServer, IconSdk } from '@tabler/icons-vue'
import { inject } from 'vue'
import { useRouteParams } from '@vueuse/router'
import { API_DOCUMENT_FILE_INJECT_KEY } from '~/constants/api-document-file-inject-key'
import { OPENDOC_SERVERS_INJECT_KEY } from '~/constants/opendoc-servers-inject-key'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key.js'

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/openapi/ui`)

const { apiDocumentFile } = inject(API_DOCUMENT_FILE_INJECT_KEY, { apiDocumentFile: null })

const openapi = computed((): OpenAPIV3.Document => {
  const str = toValue(apiDocumentFile)

  if (!str) {
    return {
      openapi: '3.0.0',
      info: {
        title: 'Untitled',
        version: '1.0.0',
      },
      paths: {},
    }
  }

  return JSON.parse(str) as OpenAPIV3.Document
})
provide(SCHEMA_INJECT_KEY, openapi)

const servers = computed(() => openapi.value.servers || [])
provide(OPENDOC_SERVERS_INJECT_KEY, { servers })

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(openapi),
  async () => {
    if (route.path === prefix.value) {
      await router.replace(`${prefix.value}/operation`)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="size-full flex">
    <ul class="bg-base-100 flex-0 d-menu d-menu-lg flex-nowrap w-fit h-full p-0 overflow-y-auto">
      <li>
        <openapi-menu-button
          :to="`${prefix}/version`"
          tip="版本"
        >
          <IconVersions class="size-8" />
        </openapi-menu-button>
      </li>

      <li>
        <openapi-menu-button
          :to="`${prefix}/operation`"
          tip="接口文档/OpenAPI"
        >
          <IconApi class="size-8" />
        </openapi-menu-button>
      </li>

      <li>
        <openapi-menu-button
          tip="数据结构/Schema"
          :to="`${prefix}/schema`"
        >
          <IconSchema class="size-8" />
        </openapi-menu-button>
      </li>

      <li>
        <openapi-menu-button
          tip="服务器/Server"
          :to="`${prefix}/server`"
        >
          <IconServer class="size-8" />
        </openapi-menu-button>
      </li>

      <li>
        <openapi-menu-button
          tip="SDK"
          :to="`${prefix}/sdk`"
        >
          <IconSdk class="size-8" />
        </openapi-menu-button>
      </li>
    </ul>

    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
