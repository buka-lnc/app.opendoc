<script setup lang="ts">
import md5 from 'md5'
import { inject } from 'vue'
import { useRouteParams } from '@vueuse/router'
import { ASYNCAPI_DOCUMENT_INJECT_KEY } from '~/constants/asyncapi-document-inject-key'
import { ASYNCAPI_SCHEMAS_INJECT_KEY } from '~/constants/asyncapi-schemas-inject-key'
import { AsyncapiSchema } from '~/types/asyncapi-schema'

const asyncapiDocument = inject(ASYNCAPI_DOCUMENT_INJECT_KEY)

const schemas = computed(
  () => Object.entries(toValue(asyncapiDocument)?.components?.schemas || {})
    .map(
      ([name, value]) => {
        const id = `#/components/schemas/${name}`
        const uid = md5(id)
        const schema: AsyncapiSchema = {
          $id: id,
          $uid: uid,
          $name: name,
          ...(value as Object),
        }

        return schema
      },
    ),
)
provide(ASYNCAPI_SCHEMAS_INJECT_KEY, schemas)

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/asyncapi/schema`)

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(schemas),
  async () => {
    if (route.path === prefix.value && schemas.value.length > 0) {
      await router.replace(`${prefix.value}/${schemas.value[0].id}`)
    }
  },
  {
    immediate: true,
  },
)

const { filter, data: filteredSchemas } = useFilter(schemas, schema => schema.$name)
</script>

<template>
  <div class="size-full flex items-stretch ">
    <div class="h-full overflow-y-auto overflow-x-hidden">
      <div class="p-2">
        <search v-model="filter" class="d-input-xs" />
      </div>

      <ul class="flex-0 flex-nowrap d-menu d-menu-sm bg-base-200 p-0 w-72 h-full">
        <li v-for="schema in filteredSchemas" :key="schema.$uid">
          <NuxtLink
            class="rounded-none w-full truncate"
            :to="`${prefix}/${schema.$uid}`"
            active-class="d-active"
          >
            {{ schema.$name }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="flex-1 bg-base-300">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
