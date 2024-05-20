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
useAsyncData(async () => {
  apiFile.value = await queryApiFileBySheetId<'200'>({
    sheetId: sheetId.value,
    version: version.value,
    path: path.value,
  })

  content.value = await queryApiFileRaw<'200'>({
    apiFileId: apiFile.value.id,
  })
    .resolveWith('text')
})

</script>

<template>
  <div class="size-full overflow-x-hidden overflow-y-auto p-10 bg-base-300">
    <markdown-view
      class="max-w-[90ch] mx-auto"
      :content="content"
    />
  </div>
</template>

<style scoped lang="postcss">
</style>
