<script setup lang="ts">
import * as R from 'ramda'
import md5 from 'md5'
import { inject } from 'vue'
import { useRouteParams } from '@vueuse/router'
import { OPENAPI_SCHEMAS_INJECT_KEY } from '~/constants/openapi-schemas-inject-key'
import { OpenapiSchema } from '~/types/openapi-schema'
import { OPENAPI_DOCUMENT_INJECT_KEY } from '~/constants/openapi-document-inject-key'

const openapi = inject(OPENAPI_DOCUMENT_INJECT_KEY)

const schemas = computed(
  () => {
    const schemas = Object.entries(toValue(openapi)?.components?.schemas || {})
      .map(
        ([name, value]): OpenapiSchema => {
          const id = `#/components/schemas/${name}`
          const uid = md5(id)

          return {
            ...value,
            $name: name,
            $id: id,
            $uid: uid,
          }
        },
      )

    return R.sortBy(R.prop('$name'), schemas)
  },
)
provide(OPENAPI_SCHEMAS_INJECT_KEY, schemas)
const { filter, data: filteredSchemas } = useFilter(schemas, schema => schema.$name)

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/openapi/schema`)

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(schemas),
  async () => {
    if (route.path === prefix.value && schemas.value.length > 0) {
      await router.replace(`${prefix.value}/${schemas.value[0].$uid}`)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="size-full flex items-stretch ">
    <div class="h-full overflow-y-auto overflow-x-hidden">
      <div class="p-2">
        <search v-model="filter" class="d-input-xs" />
      </div>

      <ul class="flex-0 flex-nowrap d-menu d-menu-sm bg-base-200 p-0 w-72 h-full">
        <li v-for="schema in filteredSchemas" :key="schema.$name">
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

    <div class="flex-1 bg-base-100">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
