<script setup lang="ts">
import type { OpenAPIV3 } from 'openapi-types'
import { IconApi, IconSchema, IconServer, IconSdk } from '@tabler/icons-vue'
import md5 from 'md5'
import { inject } from 'vue'
import { OpendocSchema } from '~/types/opendoc-schema'
import { OpendocOperation } from '~/types/opendoc-operation'
import { API_DOCUMENT_FILE_INJECT_KEY } from '~/constants/api-document-file-inject-key'
import { OPENDOC_SCHEMAS_INJECT_KEY } from '~/constants/opendoc-schemas-inject-key'
import { OPENDOC_SERVERS_INJECT_KEY } from '~/constants/opendoc-servers-inject-key'
import { OPENDOC_OPERATIONS_INJECT_KEY } from '~/constants/opendoc-operations-inject-key'

const route = useRoute()
const prefix = computed(() => `/application/${String(route.params.application_id)}/api-document/${String(route.params.api_document_id)}/openapi/ui`)

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

const servers = computed(() => openapi.value.servers || [])
provide(OPENDOC_SERVERS_INJECT_KEY, { servers })

const schemas = computed(() => Object.entries(openapi.value.components?.schemas || {})
  .map(([title, value]): OpendocSchema => ({
    id: md5(`#/components/schemas/${title}`),
    title,
    value,
  })))

provide(OPENDOC_SCHEMAS_INJECT_KEY, { schemas })

const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']
const operations = computed((): OpendocOperation[] => {
  const operations: OpendocOperation[] = []
  for (const pathname in openapi.value.paths) {
    const pathObject = openapi.value.paths[pathname]

    for (const method in pathObject) {
      if (!methods.includes(method)) {
        continue
      }

      // @ts-ignore
      const operation: OpenAPIV3.OperationObject = pathObject[method]

      operations.push({
        id: md5(`#${pathname}/${method}`),
        pathname,
        method,
        title: operation.summary || operation.operationId || '',
        value: operation,
      })
    }
  }

  return operations
})
provide(OPENDOC_OPERATIONS_INJECT_KEY, { operations })
</script>

<template>
  <div class="size-full flex">
    <ul class="flex-0 d-menu d-menu-lg w-fit h-full border-r">
      <li>
        <NuxtLink
          class="d-tooltip d-tooltip-right p-4"
          data-tip="接口模型/Operation"
          :to="`${prefix}/operation`"
          active-class="d-active"
        >
          <IconApi class="size-8" />
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          class="d-tooltip d-tooltip-right p-4"
          data-tip="数据结构/Schema"
          :to="`${prefix}/schema`"
          active-class="d-active"
        >
          <IconSchema class="size-8" />
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          class="d-tooltip d-tooltip-right p-4"
          data-tip="服务器/Server"
          :to="`${prefix}/server`"
          active-class="d-active"
        >
          <IconServer class="size-8" />
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          class="d-tooltip d-tooltip-right p-4"
          data-tip="SDK"
          :to="`${prefix}/sdk`"
          active-class="d-active"
        >
          <IconSdk class="size-8" />
        </NuxtLink>
      </li>
    </ul>

    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
