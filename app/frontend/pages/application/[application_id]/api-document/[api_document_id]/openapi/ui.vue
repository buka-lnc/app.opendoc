<script setup lang="ts">
import * as R from 'ramda'
import type { OpenAPIV3 } from 'openapi-types'
import { IconApi, IconSchema, IconServer, IconSdk } from '@tabler/icons-vue'
import md5 from 'md5'
import { inject } from 'vue'
import { OpendocSchema } from '~/types/opendoc-schema'
import { OpendocOperation } from '~/types/opendoc-operation'
import { OpendocReference } from '~/types/opendoc-reference'
import { API_DOCUMENT_FILE_INJECT_KEY } from '~/constants/api-document-file-inject-key'
import { OPENDOC_SCHEMAS_INJECT_KEY } from '~/constants/opendoc-schemas-inject-key'
import { OPENDOC_SCHEMA_MAP_INJECT_KEY } from '~/constants/opendoc-schema-map-inject-key'
import { OPENDOC_SERVERS_INJECT_KEY } from '~/constants/opendoc-servers-inject-key'
import { OPENDOC_REFERENCE_MAP_INJECT_KEY } from '~/constants/opendoc-reference-map-inject-key'
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

const schemaMap = computed(
  () => Object.entries(openapi.value.components?.schemas || {})
    .reduce(
      (map, [title, value]) => {
        const $id = `#/components/schemas/${title}`
        const id = md5($id)
        const schema: OpendocSchema = { id, $id, title, value }
        map.set(id, schema)
        map.set($id, schema)

        return map
      },
      new Map<string, OpendocSchema>(),
    ),
)
provide(OPENDOC_SCHEMA_MAP_INJECT_KEY, { schemaMap })

function resolveSchema ($ref: string): OpendocReference {
  let ref = $ref
  let target: OpenAPIV3.SchemaObject | undefined
  const path: string[] = [ref]

  while (true) {
    const schema = schemaMap.value.get(ref)
    if (!schema) break
    if ('$ref' in schema.value && schema.value.$ref) {
      ref = schema.value.$ref
      path.push(ref)
      continue
    }

    target = schema.value as OpenAPIV3.SchemaObject
    break
  }

  return { path, schema: target }
}

const referenceMap = computed(() => {
  const map = new Map<string, OpendocReference>()

  for (const schema of schemaMap.value.values()) {
    const $id = schema.$id
    map.set($id, resolveSchema($id))
  }

  return map
})
provide(OPENDOC_REFERENCE_MAP_INJECT_KEY, { referenceMap })

const schemas = computed(() => R.uniq([...schemaMap.value.values()]))
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
        deprecated: !!operation.deprecated || false,
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
    <ul class="bg-base-100 flex-0 d-menu d-menu-lg w-fit h-full p-0">
      <li>
        <NuxtLink
          :class="[
            'd-tooltip d-tooltip-right',
            'p-4 rounded-none',
            'hover:bg-base-100 active:!bg-base-100 focus:!bg-base-100 focus-visible:!bg-base-100',
            'hover:text-primary/70 active:!text-primary focus:text-primary focus-visible:text-primary'
          ]"
          data-tip="接口模型/Operation"
          :to="`${prefix}/operation`"
          active-class="text-primary"
        >
          <IconApi class="size-8" />
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          :class="[
            'd-tooltip d-tooltip-right',
            'p-4 rounded-none',
            'hover:bg-base-100 active:!bg-base-100 focus:!bg-base-100 focus-visible:!bg-base-100',
            'hover:text-primary/70 active:!text-primary focus:text-primary focus-visible:text-primary'
          ]"
          data-tip="数据结构/Schema"
          :to="`${prefix}/schema`"
          active-class="text-primary"
        >
          <IconSchema class="size-8" />
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          :class="[
            'd-tooltip d-tooltip-right',
            'p-4 rounded-none',
            'hover:bg-base-100 active:!bg-base-100 focus:!bg-base-100 focus-visible:!bg-base-100',
            'hover:text-primary/70 active:!text-primary focus:text-primary focus-visible:text-primary'
          ]"
          data-tip="服务器/Server"
          :to="`${prefix}/server`"
          active-class="text-primary"
        >
          <IconServer class="size-8" />
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          :class="[
            'd-tooltip d-tooltip-right',
            'p-4 rounded-none',
            'hover:bg-base-100 active:!bg-base-100 focus:!bg-base-100 focus-visible:!bg-base-100',
            'hover:text-primary/70 active:!text-primary focus:text-primary focus-visible:text-primary'
          ]"
          data-tip="SDK"
          :to="`${prefix}/sdk`"
          active-class="text-primary"
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
