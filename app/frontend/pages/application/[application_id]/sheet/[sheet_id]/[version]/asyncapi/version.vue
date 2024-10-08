<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import * as R from 'ramda'
import { querySheetVersions } from '~/api/backend'

const sheetId = useRouteParams<string>('sheet_id')

const { pending, data: sheetVersions, execute: reload } = useAsyncData(
  async () => {
    const body = await querySheetVersions<'200'>({
      sheetId: sheetId.value,
    })
    return body.results
  },
  {
    default: () => [],
  },
)
useIntervalFn(reload, 10000)

const versionTagMap = computed(() => {
  const tags = R.groupBy(
    version => version.tag || 'latest',
    sheetVersions.value,
  )

  const mapping: Record<string, string> = {}

  for (const [tag, versions] of Object.entries(tags)) {
    if (versions?.length) {
      const version = versions[0].string
      mapping[version] = tag
    }
  }

  return mapping
})
</script>

<template>
  <StuffedLoading
    v-if="pending"
    :pending="pending"
  />
  <div
    v-if="!pending"
    class="bg-ctp-base p-10"
  >
    <div
      v-for="sheetVersion in sheetVersions"
      :key="sheetVersion.id"
      class="d-card bg-ctp-mantle rounded-sm"
    >
      <asyncapi-version-preview-card
        :sheet-version="sheetVersion"
        :tag="versionTagMap[sheetVersion.string]"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
