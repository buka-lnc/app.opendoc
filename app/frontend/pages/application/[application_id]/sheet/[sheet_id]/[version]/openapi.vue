<script setup lang="ts">
import { IconVersions, IconApi, IconSchema, IconServer, IconSdk } from '@tabler/icons-vue'
import { useRouteParams } from '@vueuse/router'
import { OpenAPIV3 } from 'openapi-types'
import { queryApiFileBySheetId, queryApiFileRaw } from '~/api/backend'
import { DEREFERENCE_SCHEMA_INJECT_KEY } from '~/constants/dereference-schema-inject-key'
import { OPENAPI_DOCUMENT_INJECT_KEY } from '~/constants/openapi-document-inject-key'

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/openapi`)

const { data: openapiDocument } = useAsyncData(
  async () => {
    const apiFile = await queryApiFileBySheetId<'200'>({
      sheetId: sheetId.value,
      version: version.value,
      path: 'openapi.json',
    })

    const swagger: OpenAPIV3.Document = await queryApiFileRaw({
      apiFileId: apiFile.id,
    })
      .resolveWith('json')

    return swagger
  },
  {
    default: () => ({
      openapi: '3.0.0',
      info: {
        title: 'Untitled',
        version: '1.0.0',
      },
      paths: {},
    }),
  },
)

provide(OPENAPI_DOCUMENT_INJECT_KEY, openapiDocument)
provide(DEREFERENCE_SCHEMA_INJECT_KEY, openapiDocument)

const route = useRoute()
const router = useRouter()
watchEffect(async () => {
  if (route.path === prefix.value) {
    await router.replace(`${prefix.value}/operation`)
  }
})
</script>
<template>
  <div class="size-full flex overflow-hidden">
    <icon-menu-container class="bg-ctp-crust">
      <icon-menu-button
        :to="`${prefix}/version`"
        tip="版本"
      >
        <IconVersions class="size-8" />
      </icon-menu-button>

      <icon-menu-button
        :to="`${prefix}/operation`"
        tip="接口文档/OpenAPI"
      >
        <IconApi class="size-8" />
      </icon-menu-button>

      <icon-menu-button
        tip="数据结构/Schema"
        :to="`${prefix}/schema`"
      >
        <IconSchema class="size-8" />
      </icon-menu-button>

      <icon-menu-button
        tip="服务器/Server"
        :to="`${prefix}/server`"
      >
        <IconServer class="size-8" />
      </icon-menu-button>
      <icon-menu-button
        tip="SDK"
        :to="`${prefix}/sdk`"
      >
        <IconSdk class="size-8" />
      </icon-menu-button>
    </icon-menu-container>

    <div class="flex-auto">
      <NuxtPage />
    </div>
  </div>
</template>
