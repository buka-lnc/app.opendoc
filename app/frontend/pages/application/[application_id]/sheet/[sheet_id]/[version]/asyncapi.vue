<script setup lang="ts">
import * as semver from 'semver'
import { IconVersions, IconSchema, IconSdk, IconMessage2, IconServer } from '@tabler/icons-vue'
import { useRouteParams } from '@vueuse/router'
import { convert } from '@asyncapi/converter'
import { queryApiFileBySheetId, queryApiFileRaw } from '~/api/backend'
import { DEREFERENCE_SCHEMA_INJECT_KEY } from '~/constants/dereference-schema-inject-key'
import { ASYNCAPI_DOCUMENT_INJECT_KEY } from '~/constants/asyncapi-document-inject-key'

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/asyncapi`)

const { data: asyncapiDocument } = useAsyncData(
  async () => {
    const apiFile = await queryApiFileBySheetId<'200'>({
      sheetId: sheetId.value,
      version: version.value,
      path: 'asyncapi.json',
    })

    const doc: any = await queryApiFileRaw({
      apiFileId: apiFile.id,
    })
      .resolveWith('json')

    if (semver.lt(doc.asyncapi, '3.0.0')) {
      return convert(doc, '3.0.0')
    }

    return doc
  },
  {
    default: () => ({
      asyncapi: '3.0.0',
      info: {
        title: 'Untitled',
        version: '1.0.0',
      },
      tags: [],
      servers: [],
      components: {},
      channels: {},
    }),
  },
)

provide(ASYNCAPI_DOCUMENT_INJECT_KEY, asyncapiDocument)
provide(DEREFERENCE_SCHEMA_INJECT_KEY, asyncapiDocument)

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(asyncapiDocument),
  async () => {
    if (route.path === prefix.value) {
      await router.replace(`${prefix.value}/schema`)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="size-full flex overflow-hidden">
    <icon-menu-container>
      <icon-menu-button
        :to="`${prefix}/version`"
        tip="版本"
      >
        <IconVersions class="size-8" />
      </icon-menu-button>

      <icon-menu-button
        tip="通道/Channel"
        :to="`${prefix}/channel`"
      >
        <IconMessage2 class="size-8" />
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

<style scoped lang="postcss">
</style>
