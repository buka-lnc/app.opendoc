<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { querySdks } from '~/api/backend'
import { SheetVersion } from '~/api/backend/components/schemas'

const route = useRoute()
const version = useRouteParams<string>('version')

const props = defineProps<{
  sheetVersion: SheetVersion
  tag?: string
}>()

const { isLoading: pending, state: sdks } = useAsyncState(
  async () => {
    const body = await querySdks<'200'>({
      sheetId: props.sheetVersion.sheet.id,
      version: props.sheetVersion.string,
    })
      .flowControl('serial')

    return body.results
  },
  [],
)

const sdkStatus = computed(() => {
  if (sdks.value.some(sdk => sdk.status === 'compiling')) return 'compiling'
  else if (sdks.value.every(sdk => sdk.status === 'published')) return 'published'
  else if (sdks.value.every(sdk => sdk.status === 'pending')) return 'pending'
})

</script>

<template>
  <div class="d-card-body py-2 flex flex-row items-center justify-between">
    <div class="flex items-center space-x-2">
      <h2 class="d-card-title inline-block">
        v{{ sheetVersion.string }}
      </h2>

      <sdk-status-badge
        v-if="!pending && !!sdks.length"
        class="select-none"
        :status="sdkStatus"
      />

      <span
        v-if="tag"
        class="d-badge d-badge-outline d-badge-secondary select-none"
      >
        {{ tag }}
      </span>
    </div>

    <div class="d-card-actions">
      <NuxtLink
        :to="{ params: { ...route.params, version: sheetVersion.string }}"
        class="d-btn d-btn-sm font-sans"
        :aria-disabled="version === sheetVersion.string"
        :class="version === sheetVersion.string && 'd-btn-disabled'"
      >
        {{ version === sheetVersion.string ? '当前版本' : '查看' }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
