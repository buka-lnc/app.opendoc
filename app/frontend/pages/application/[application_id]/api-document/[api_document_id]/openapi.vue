<script setup lang="ts">
import { IconCode, IconBrowser } from '@tabler/icons-vue'

const route = useRoute()
const prefix = computed(() => `/application/${String(route.params.application_id)}/api-document/${String(route.params.api_document_id)}/openapi`)

</script>
<template>
  <div class="flex flex-col size-full overflow-hidden">
    <div class="flex-1 overflow-hidden">
      <NuxtPage />
    </div>
    <div class="flex-0 px-2 flex items-center justify-between bg-base-100/50">
      <div />

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
