<script setup lang="ts">
import type { OpenAPIV3 } from 'openapi-types'
import md5 from 'md5'
import { OpendocSchema } from '~/types/opendoc-schema'
import { OpendocOperation } from '~/types/opendoc-operation'

const props = defineProps<{
  value: string
}>()

const openapi = computed(() => JSON.parse(props.value) as OpenAPIV3.Document)

const servers = computed(() => openapi.value.servers || [])

const schemas = computed(() => Object.entries(openapi.value.components?.schemas || {})
  .map(([title, value]): OpendocSchema => ({
    id: md5(`#/components/schemas/${title}`),
    title,
    value,
  })))

const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']
const operations = computed(() => {
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
</script>
<template>
  <div class="flex">
    <div class="overflow-y-scroll h-full bg-base-200">
      <ul class="d-menu d-menu-sm border-r flex-nowrap">
        <li class="d-menu-title">
          Server
        </li>

        <li v-for="server in servers" :key="server.url">
          <div class="inline-flex flex-col items-start gap-0">
            <span>{{ server.description || server.url }}</span>
            <span
              v-if="server.description"
              class="text-xs leading-3 text-gray-400"
            >{{ server.url }}</span>
          </div>
        </li>

        <li class="d-menu-title">
          Path
        </li>

        <li v-for="operation in operations" :key="operation.id">
          <div class="inline-flex flex-col items-start gap-0">
            <span class="leading-6">{{ operation.title }}</span>
            <span class="text-xs leading-3 text-gray-400">{{ operation.pathname }}</span>
          </div>
        </li>

        <li class="d-menu-title">
          Schema
        </li>
        <li v-for="schema in schemas" :key="schema.title">
          <div>{{ schema.title }}</div>
        </li>
      </ul>
    </div>

    <div>
      123
    </div>
  </div>
</template>
