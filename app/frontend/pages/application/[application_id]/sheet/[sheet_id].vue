<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { queryApiFiles, querySheetById, querySheetVersions } from '~/api/backend'
import { ApiFile, Sheet, SheetVersion } from '~/api/backend/components/schemas'
import { SHEET_INJECT_KEY } from '~/constants/sheet-inject-key'

const route = useRoute()

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}`)

const sheet = ref<Sheet | null>(null)
const apiFiles = ref<ApiFile[]>([])
const sheetVersions = ref<SheetVersion[]>([])

provide(SHEET_INJECT_KEY, sheet)

const { pending } = useAsyncData(
  async () => {
    const [sheetRes, apiFilesRes, sheetVersionsRes] = await Promise.all([
      querySheetById<'200'>({
        sheetId: sheetId.value,
      }),

      queryApiFiles<'200'>({
        sheetId: sheetId.value,
      }),

      querySheetVersions({
        sheetId: sheetId.value,
      }),
    ])

    sheet.value = sheetRes
    apiFiles.value = apiFilesRes.results
    sheetVersions.value = sheetVersionsRes.results
  },
  {
    immediate: true,
  },
)

const router = useRouter()
watchEffect(async () => {
  if (!sheetVersions.value.length || !sheet.value) return

  if (route.path === prefix.value) {
    if (!apiFiles.value.length) return
    const version = sheetVersions.value[0].version

    if (sheet.value.type === 'markdown') {
      await router.replace(`${prefix.value}/${version}/markdown`)
    } else if (sheet.value.type === 'openapi') {
      await router.replace(`${prefix.value}/${version}/openapi/operation`)
    } else if (sheet.value.type === 'asyncapi') {
      await router.replace(`${prefix.value}/${version}/asyncapi/schema`)
    }
  }
})
</script>

<template>
  <div class="size-full">
    <nuxt-page v-if="sheet && !pending" />
  </div>
</template>

<style scoped lang="postcss">
</style>
