<script setup lang="ts">
import { IconVersions, IconCode, IconBrowser } from '@tabler/icons-vue'
import { useRouteParams } from '@vueuse/router'

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/api-document/${apiDocumentId.value}/${version.value}/asyncapi`)

</script>
<template>
  <div class="flex flex-col size-full overflow-hidden">
    <div class="flex-1 overflow-hidden">
      <NuxtPage />
    </div>

    <div class="flex-0 px-4 flex items-center justify-between bg-base-100/50 text-xs">
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
            class="d-join-item d-btn d-btn-xs d-btn-ghost d-btn-square"
            :to="`${prefix}/ui`"
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
