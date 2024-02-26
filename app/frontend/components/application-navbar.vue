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
        <template
          v-for="apiDocument of props.application.apiDocuments"
          :key="apiDocument.id"
        >
          <NuxtLink
            v-if="apiDocument.type === 'openapi'"
            :to="`/application/${$route.params.application_id}/api-document/${apiDocument.id}/openapi/ui`"
            replace
            class="d-tab"
            :class="{
              'd-tab-active': $route.params.api_document_id === apiDocument.id,
            }"
          >
            {{ apiDocument.title }}
          </NuxtLink>

          <NuxtLink
            v-if="apiDocument.type === 'markdown'"
            :to="`/application/${$route.params.application_id}/api-document/${apiDocument.id}/markdown`"
            replace
            class="d-tab"
            :class="{
              'd-tab-active': $route.params.api_document_id === apiDocument.id,
            }"
          >
            {{ apiDocument.title }}
          </NuxtLink>
        </template>
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
