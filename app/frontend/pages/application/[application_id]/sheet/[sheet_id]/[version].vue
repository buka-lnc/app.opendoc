<script setup lang="ts">
import { IconVersions, IconCode, IconBrowser } from '@tabler/icons-vue'
import { useRouteParams } from '@vueuse/router'
import { SHEET_INJECT_KEY } from '~/constants/sheet-inject-key'

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}`)

const sheet = inject(SHEET_INJECT_KEY)
</script>

<template>
  <div class="flex flex-col size-full overflow-hidden">
    <div class="flex-1 overflow-hidden">
      <NuxtPage />
    </div>

    <div class="flex-0 px-4 flex items-center justify-between bg-base-300/50 text-xs">
      <div>
        <div
          class="d-tooltip d-tooltip-right text-base-content/60 flex cursor-default"
          :data-tip="`版本：${version}`"
        >
          <IconVersions class="size-4 mr-1" />
          {{ version }}
        </div>
      </div>

      <div class="flex items-center space-x-1">
        <div class="d-join">
          <NuxtLink
            class="d-join-item d-btn d-btn-xs d-btn-ghost d-btn-square"
            :to="`${prefix}/code`"
            active-class="d-btn-active"
          >
            <IconCode
              class="size-4"
            />
          </NuxtLink>

          <NuxtLink
            v-if="sheet"
            class="d-join-item d-btn d-btn-xs d-btn-ghost d-btn-square"
            :to="`${prefix}/${sheet.type}`"
            active-class="d-btn-active"
          >
            <IconBrowser
              class="size-4"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
