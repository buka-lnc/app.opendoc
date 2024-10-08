<script setup lang="ts">
import * as R from 'ramda'
import { useRouteParams } from '@vueuse/router'
import { queryApiFiles } from '~/api/backend'
import { ApiFileCategory } from '~/types/api-file-category'

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/markdown`)

const { data: apiFiles } = useAsyncData(
  async () => {
    const body = await queryApiFiles<'200'>({
      sheetId: sheetId.value,
      version: version.value,
    })

    return R.sortBy(R.prop('path'), body.results)
  },
  {
    default: () => [],
  },
)

const categories = toApiFileCategories(apiFiles)

const route = useRoute()
const router = useRouter()
watchEffect(() => {
  if (route.path !== prefix.value) return
  if (apiFiles.value.length === 0) return
  const apiFile = apiFiles.value[0]
  if (!apiFile) return

  void router.replace(`${prefix.value}/${apiFile.path}`)
})
</script>

<template>
  <div class="size-full flex flex-row">
    <div class="w-72 flex-shrink-0 flex-grow-0 overflow-y-auto bg-ctp-mantle">
      <api-file-categories
        :categories="categories"
        :to="(category: ApiFileCategory) => `${prefix}/${category.$path}`"
      />
    </div>

    <div class="flex-1 bg-ctp-base overflow-hidden">
      <nuxt-page />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
