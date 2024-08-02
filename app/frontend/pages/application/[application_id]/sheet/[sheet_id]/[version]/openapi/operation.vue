<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'
import md5 from 'md5'
import { useRouteParams } from '@vueuse/router'
import { OPENAPI_DOCUMENT_INJECT_KEY } from '~/constants/openapi-document-inject-key'
import { OPENAPI_OPERATIONS_INJECT_KEY } from '~/constants/openapi-operations-inject-key'
import { OpenapiOperation } from '~/types/openapi-operation'

const openapiDocument = inject(OPENAPI_DOCUMENT_INJECT_KEY)

const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']
const operations = computed((): OpenapiOperation[] => {
  const operations: OpenapiOperation[] = []
  for (const pathname in openapiDocument?.value.paths) {
    const pathObject = openapiDocument.value.paths[pathname]

    for (const method in pathObject) {
      if (!methods.includes(method)) {
        continue
      }

      // @ts-ignore
      const operation: OpenAPIV3.OperationObject = pathObject[method]

      operations.push({
        ...operation,
        $uid: md5(`#${pathname}/${method}`),
        $pathname: pathname,
        $method: method,
      })
    }
  }

  return operations
})
provide(OPENAPI_OPERATIONS_INJECT_KEY, operations)

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/openapi/operation`)

const route = useRoute()
const router = useRouter()
watchEffect(async () => {
  if (!operations.value.length) return
  if (route.path !== prefix.value) return

  await router.replace(`${prefix.value}/${operations.value[0].$uid}`)
})

const { filter, data: filteredOperations } = useFilter(
  operations,
  operation => [operation.$pathname, operation.summary]
    .filter(R.isNotNil)
    .join(' '),
)

const groups = computed(() => {
  const operationMap = R.groupBy(
    (operation: OpenapiOperation) => JSON.stringify(operation.tags || []),
    toValue(filteredOperations),
  )

  const groups = R.toPairs(operationMap)
    .map(([key, operations]) => ({
      key,
      tags: JSON.parse(key),
      operations,
    }))
    .sort(R.ascend(o => o.tags.length))

  return groups
})

const counter = computed(() => ({
  get: operations.value.filter(o => o.$method.toLowerCase() === 'get').length,
  post: operations.value.filter(o => o.$method.toLowerCase() === 'post').length,
  put: operations.value.filter(o => o.$method.toLowerCase() === 'put').length,
  delete: operations.value.filter(o => o.$method.toLowerCase() === 'delete').length,
  patch: operations.value.filter(o => o.$method.toLowerCase() === 'patch').length,
}))
</script>

<template>
  <div class="size-full flex items-stretch">
    <div class="bg-base-200 flex-0 overflow-y-auto overflow-x-hidden h-full">
      <div class="p-2">
        <search v-model="filter" class="d-input-xs" />

        <div class="w-full px-1 text-xs text-base-content/50 font-bold inline-flex justify-between">
          <span>GET: {{ counter.get }}</span>
          <span>POS: {{ counter.post }}</span>
          <span>PUT: {{ counter.put }}</span>
          <span>PAT: {{ counter.patch }}</span>
          <span>DEL: {{ counter.delete }}</span>
        </div>
      </div>

      <ul class="flex-nowrap d-menu d-menu-sm w-72 h-full">
        <template v-for="group in groups" :key="group.key">
          <li v-if="group.tags.length" class="d-menu-title">
            {{ group.tags.join(',') }}
          </li>

          <li v-for="operation in group.operations" :key="operation.$uid">
            <NuxtLink
              class="block w-full"
              :to="{ path: `${prefix}/${operation.$uid}`, query: $route.query }"
              active-class="d-active"
            >
              <OpenapiOperationPreviewCard :operation="operation" />
            </NuxtLink>
          </li>
        </template>
      </ul>
    </div>

    <div class="flex-1 bg-base-100">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
