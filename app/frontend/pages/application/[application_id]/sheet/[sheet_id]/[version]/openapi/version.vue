<script setup lang="ts">
import * as R from 'ramda'
import * as semver from 'semver'
import { useRouteParams } from '@vueuse/router'
import { querySheetVersions } from '~/api/backend/query_sheet_versions.js'

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

  for (const [tag, sheetVersions] of Object.entries(tags)) {
    if (sheetVersions?.length) {
      const versions = R.pluck('string', sheetVersions)
      const maxVersion = R.sort(semver.rcompare, versions)[0]
      mapping[maxVersion] = tag
    }
  }

  return mapping
})
</script>

<template>
  <StuffedLoading :pending="pending">
    <div class="h-full p-10 bg-base-100 space-y-1">
      <div
        v-for="sheetVersion in sheetVersions"
        :key="sheetVersion.id"
        class="d-card d-card-compact bg-ctp-mantle font-sans rounded-md"
      >
        <openapi-version-preview-card
          :sheet-version="sheetVersion"
          :tag="versionTagMap[sheetVersion.string]"
        />
      </div>
    </div>
  </StuffedLoading>
</template>

<style scoped lang="postcss">
</style>
