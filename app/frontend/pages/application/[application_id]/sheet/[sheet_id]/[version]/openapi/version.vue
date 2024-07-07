<script setup lang="ts">
import * as R from 'ramda'
import semver from 'semver'
import { useRouteParams } from '@vueuse/router'
import { querySheetVersions } from '~/api/backend/query_sheet_versions.js'

const sheetId = useRouteParams<string>('sheet_id')

const { pending, data: sheetVersions } = useAsyncData(
  async () => {
    const body = await querySheetVersions<'200'>({
      sheetId: sheetId.value,
    })
    console.log('🚀 ~ body:', body)
    return body.results
  },
  {
    default: () => [],
  },
)

const versionTagMap = computed(() => {
  const tags = R.groupBy(
    version => version.tag || 'latest',
    sheetVersions.value,
  )

  const mapping: Record<string, string> = {}

  for (const [tag, sheetVersions] of Object.entries(tags)) {
    if (sheetVersions?.length) {
      const versions = sheetVersions.map(R.prop('version'))
      const maxVersion = R.sort(semver.rcompare, versions)[0]
      mapping[maxVersion] = tag
    }
  }

  return mapping
})

</script>

<template>
  <StuffedLoading v-if="pending" :pending="pending" />
  <div v-if="!pending" class="p-10">
    <div
      v-for="sheetVersion in sheetVersions"
      :key="sheetVersion.id"
      class="d-card bg-base-300 rounded-sm"
    >
      <openapi-version-preview-card
        :sheet-version="sheetVersion"
        :tag="versionTagMap[sheetVersion.version]"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
