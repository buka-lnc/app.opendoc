<script setup lang="ts">
import { IconSettings, IconPlus, IconArrowBackUp } from '@tabler/icons-vue'
import { Application } from '~/api/backend/components/schemas'

const props = defineProps<{
  application: Application
}>()

defineEmits<{
  'changed:application': [code: string]
  'created:apiDocument': [code: string]
  'deleted:apiDocument': [code: string]
}>()

const showApplicationSettings = ref(false)
const showApiDocumentCreateModal = ref(false)
</script>

<template>
  <div class="d-navbar bg-base-100">
    <ApplicationSettingsModal
      v-model:show="showApplicationSettings"
      :application="props.application"
      @changed:application="$emit('changed:application', $event)"
      @deleted:api-document="$emit('deleted:apiDocument', $event)"
    />

    <ApiDocumentCreateModal
      v-model:show="showApiDocumentCreateModal"
      :application="props.application"
      @created:api-document="$emit('created:apiDocument', $event)"
    />

    <div class="d-navbar-start space-x-2">
      <button
        class="d-btn d-btn-square d-btn-ghost"
        @click="$router.push('/applications')"
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
            :to="`/application/${$route.params.application_id}/api-document/${apiDocument.id}`"
            class="d-tab"
            :class="{
              'd-tab-active': $route.params.api_document_id === apiDocument.id,
            }"
          >
            {{ apiDocument.title }}
          </NuxtLink>

          <NuxtLink
            v-if="apiDocument.type === 'markdown'"
            :to="`/application/${$route.params.application_id}/api-document/${apiDocument.id}`"
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
      <button class="d-btn d-btn-square d-btn-ghost" @click="showApiDocumentCreateModal = true">
        <IconPlus class="w-6 h-6" />
      </button>

      <button class="d-btn d-btn-square d-btn-ghost" @click="showApplicationSettings = true">
        <IconSettings class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
