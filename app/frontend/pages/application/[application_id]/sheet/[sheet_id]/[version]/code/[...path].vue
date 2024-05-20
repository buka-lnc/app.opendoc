<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { queryApiFileBySheetId, queryApiFileRaw } from '~/api/backend'
import { ApiFile } from '~/api/backend/components/schemas'

const route = useRoute()
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const path = computed(() => (route.params.path as string[]).join('/'))

const apiFile = ref<ApiFile | null>(null)
const content = ref<string>('')

// eslint-disable-next-line @typescript-eslint/no-floating-promises
useAsyncData(
  async () => {
    apiFile.value = await queryApiFileBySheetId<'200'>({
      sheetId: sheetId.value,
      version: version.value,
      path: path.value,
    })

    content.value = await queryApiFileRaw<'200'>({
      apiFileId: apiFile.value.id,
    })
      .resolveWith('text')
  },
)

const lang = computed(() => {
  if (!apiFile.value) return ''
  const extend = apiFile.value.path.split('.').pop() || ''
  if (!extend) return 'text'
  if (['json'].includes(extend)) return 'json'
  if (['yaml', 'yml'].includes(extend)) return 'yaml'
  if (['md'].includes(extend)) return 'markdown'

  return extend
})
</script>

<template>
  <div class="size-full">
    <monaco
      v-if="apiFile"
      :key="apiFile.id"
      class="size-full"
      :lang="lang"
      :content="content"
      format
    />
  </div>
</template>

<style scoped lang="postcss">
</style>
