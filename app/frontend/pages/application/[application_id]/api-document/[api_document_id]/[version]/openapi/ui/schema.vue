<script setup lang="ts">
import type { OpenAPIV3 } from 'openapi-types'
import md5 from 'md5'
import { inject } from 'vue'
import { useRouteParams } from '@vueuse/router'
import { OPENDOC_SCHEMAS_INJECT_KEY } from '~/constants/opendoc-schemas-inject-key'
import { OpendocSchema } from '~/types/opendoc-schema'
import { SCHEMA_INJECT_KEY } from '~/constants/schema-inject-key.js'

const openapi = inject<Ref<OpenAPIV3.Document>>(SCHEMA_INJECT_KEY)

const schemas = computed(
  () => Object.entries(toValue(openapi)?.components?.schemas || {})
    .map(
      ([title, value]) => {
        const $id = `#/components/schemas/${title}`
        const id = md5($id)
        const schema: OpendocSchema = { id, $id, title, value }

        return schema
      },
    ),
)
provide(OPENDOC_SCHEMAS_INJECT_KEY, { schemas })

const route = useRoute()
const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/openapi/ui/schema`)

const router = useRouter()
watch(
  () => toValue(schemas),
  async () => {
    const results = toValue(schemas)

    if (route.path === prefix.value && results.length > 0) {
      await router.replace(`${prefix.value}/${results[0].id}`)
    }
  },
  {
    immediate: true,
  },
)

const { filter, data: filteredSchemas } = useFilter(schemas, schema => schema.title)
</script>

<template>
  <div class="size-full flex items-stretch ">
    <div class="h-full overflow-y-auto overflow-x-hidden">
      <div class="p-2">
        <search v-model="filter" />
      </div>

      <ul class="flex-0 flex-nowrap d-menu d-menu-sm bg-base-200 p-0 w-fit h-full">
        <li v-for="schema in filteredSchemas" :key="schema.title">
          <NuxtLink
            class="rounded-none"
            :to="`${prefix}/${schema.id}`"
            active-class="d-active"
          >
            {{ schema.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
