<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { queryApiFiles } from '~/api/backend'

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/code`)

const { data: apiFiles, status } = useAsyncData(
  async () => {
    const body = await queryApiFiles<'200'>({
      sheetId: sheetId.value,
      version: version.value,
    })

    return body.results
  },
  {
    default: () => [],
  },
)

const categories = toApiFileCategories(apiFiles)

const route = useRoute()
const router = useRouter()
watchEffect(() => {
  if (status.value === 'pending') return
  if (route.path !== prefix.value) return
  if (apiFiles.value.length === 0) return
  const apiFile = apiFiles.value[0]
  if (!apiFile) return

  void router.replace(`${prefix.value}/${apiFile.path}`)
})
</script>

<template>
  <div class="size-full flex flex-row">
    <div class="bg-ctp-mantle w-72 flex-shrink-0 flex-grow-0 overflow-y-auto">
      <api-file-categories
        :categories="categories"
        :to="(category) => `${prefix}/${category.$path}`"
      />
    </div>

    <div class="flex-1 bg-ctp-base">
      <nuxt-page />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
