<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'
import md5 from 'md5'
import { useRouteParams } from '@vueuse/router'
import { OPENDOC_OPERATIONS_INJECT_KEY } from '~/constants/opendoc-operations-inject-key'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key.js'
import { OpendocOperation } from '~/types/opendoc-operation.js'
import { IconSearch } from '@tabler/icons-vue'

const openapi = inject<Ref<OpenAPIV3.Document>>(SCHEMA_INJECT_KEY)
const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']
const operations = computed((): OpendocOperation[] => {
  const operations: OpendocOperation[] = []
  for (const pathname in openapi?.value.paths) {
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
        description: operation.description || 'No description',
        value: operation,
      })
    }
  }

  return operations
})
provide(OPENDOC_OPERATIONS_INJECT_KEY, { operations })

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/openapi/ui/operation`)

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(operations),
  async () => {
    const ops = toValue(operations)

    if (route.path === prefix.value && ops.length > 0) {
      await router.push(`${prefix.value}/${ops[0].id}`)
    }
  },
  {
    immediate: true,
  },
)

const { filter, data: filteredOperations } = useFilter(
  operations,
  (operation) => [operation.pathname, operation.value.summary]
  .filter(R.isNotNil)
  .join(' ')
)

const groups = computed(() => {
  const operationMap = R.groupBy(
    (operation: OpendocOperation) => JSON.stringify(operation.value.tags || []),
    toValue(filteredOperations),
  )

  const groups = R.toPairs(operationMap)
    .map(([key, value]) => ({
      key,
      tags: JSON.parse(key),
      operations: value,
    }))
    .sort(R.ascend(o => o.tags.length))

  return groups
})

const counter = computed(() => ({
  get: operations.value.filter(o => o.method.toLowerCase() === 'get').length,
  post: operations.value.filter(o => o.method.toLowerCase() === 'post').length,
  put: operations.value.filter(o => o.method.toLowerCase() === 'put').length,
  delete: operations.value.filter(o => o.method.toLowerCase() === 'delete').length,
}))

</script>

<template>
  <div class="size-full flex items-stretch">
    <div class="bg-base-200 flex-0 overflow-y-auto overflow-x-hidden h-full">
      <div class="p-2">
        <search v-model="filter" />

        <div class="w-full px-1 text-xs text-base-content/50 font-bold inline-flex justify-between">
          <span>GET: {{ counter.get }}</span>
          <span>POS: {{ counter.post }}</span>
          <span>PUT: {{ counter.put }}</span>
          <span>DEL: {{ counter.delete }}</span>
        </div>
      </div>


      <ul class="flex-nowrap d-menu d-menu-sm bg-base-200 p-0 w-72 h-full">
        <template v-for="group in groups" :key="group.key">
          <li v-if="group.tags.length" class="d-menu-title">
            {{ group.tags.join(',') }}
          </li>

          <li v-for="operation in group.operations" :key="operation.id">
            <NuxtLink
              class="block rounded-none p-0 w-full"
              :to="{ path: `${prefix}/${operation.id}`, query: $route.query }"
              active-class="d-active"
            >
              <OpenapiOperationPreviewCard :operation="operation" />
            </NuxtLink>
          </li>
        </template>
      </ul>
    </div>

    <div class="flex-1 bg-base-300">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
