<script setup lang="ts">
import { IconSettings, IconArrowBackUp } from '@tabler/icons-vue'
import { Application } from '~/api/backend/components/schemas'

const props = defineProps<{
  application: Application
}>()
</script>

<template>
  <div class="d-navbar bg-base-100">
    <div class="d-navbar-start space-x-2">
      <button
        class="d-btn d-btn-square d-btn-ghost"
        @click="$router.back()"
      >
        <IconArrowBackUp class="w-6 h-6" />
      </button>

      <div class="flex items-baseline space-x-1">
        <h1 class="text-xl">
          {{ props.application.title }}
        </h1>
        <span class="text-gray-400">{{ props.application.code }}</span>
      </div>
    </div>

    <div role="tablist" class="d-navbar-center">
      <div class="d-tabs d-tabs-boxed d-tabs">
        <NuxtLink
          v-for="apiDocument of props.application.apiDocuments"
          :key="apiDocument.id"
          :to="`/application/${$route.params.application_id}/api-document/${apiDocument.id}`"
          replace
          class="d-tab"
          active-class="d-tab-active"
        >
          {{ apiDocument.title }}
        </NuxtLink>
      </div>
    </div>

    <div class="d-navbar-end">
      <button class="d-btn d-btn-square d-btn-ghost">
        <IconSettings class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
