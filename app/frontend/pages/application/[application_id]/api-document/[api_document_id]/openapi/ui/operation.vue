<script setup lang="ts">
import { OpenAPIV3 } from 'openapi-types'
import * as R from 'ramda'
import md5 from 'md5'
import { OPENDOC_OPERATIONS_INJECT_KEY } from '~/constants/opendoc-operations-inject-key'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key.js'
import { OpendocOperation } from '~/types/opendoc-operation.js'

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

const route = useRoute()
const prefix = computed(() => `/application/${String(route.params.application_id)}/api-document/${String(route.params.api_document_id)}/openapi/ui/operation`)

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

const groups = computed(() => {
  const operationMap = R.groupBy(
    (operation: OpendocOperation) => JSON.stringify(operation.value.tags || []),
    toValue(operations),
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
</script>

<template>
  <div class="size-full flex items-stretch">
    <div class="bg-base-200 flex-0 overflow-y-auto overflow-x-hidden h-full">
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
