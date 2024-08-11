<script setup lang="ts">
import { IconSettings, IconPlus, IconArrowBackUp } from '@tabler/icons-vue'
import { useRouteParams } from '@vueuse/router'
import { APPLICATION_INJECT_KEY } from '~/constants/application-inject-key'

const router = useRouter()
const { application, sheets } = inject(APPLICATION_INJECT_KEY, { application: toRef(null), sheets: toRef([]) })
const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const prefix = computed(() => `/application/${applicationId.value}`)

defineEmits<{
  'updated:application': [code: string]
  'created:sheet': [code: string]
  'deleted:sheet': [code: string]
  'updated:sheet': [code: string]
}>()

const showApplicationSettings = ref(false)
const showApiDocumentCreateModal = ref(false)

</script>

<template>
  <div v-if="application" class="d-navbar bg-ctp-crust">
    <application-settings-modal
      v-model:show="showApplicationSettings"
      @updated:application="$emit('updated:application', $event)"
      @deleted:sheet="$emit('deleted:sheet', $event)"
      @updated:sheet="$emit('updated:sheet', $event)"
    />

    <sheet-create-modal
      v-model:show="showApiDocumentCreateModal"
      :application="application"
      @created:sheet="$emit('created:sheet', $event)"
    />

    <div class="d-navbar-start space-x-2">
      <button
        class="d-btn d-btn-square d-btn-ghost"
        @click="router.push('/applications')"
      >
        <IconArrowBackUp class="size-6" />
      </button>

      <div class="flex items-baseline space-x-1">
        <h1 class="text-xl">
          {{ application.title }}
        </h1>
        <span class="text-base-content/50">{{ application.code }}</span>
      </div>
    </div>

    <div role="tablist" class="d-navbar-center">
      <div class="d-tabs d-tabs-boxed">
        <template
          v-for="sheet of sheets"
          :key="sheet.id"
        >
          <nuxt-link
            v-if="sheet.type === 'openapi'"
            :to="`${prefix}/sheet/${sheet.id}`"
            class="d-tab"
            :class="{
              'd-tab-active': sheetId === sheet.id,
            }"
          >
            {{ sheet.title }}
          </nuxt-link>

          <nuxt-link
            v-if="sheet.type === 'markdown'"
            :to="`${prefix}/sheet/${sheet.id}`"
            class="d-tab"
            :class="{
              'd-tab-active': sheetId === sheet.id,
            }"
          >
            {{ sheet.title }}
          </nuxt-link>

          <nuxt-link
            v-if="sheet.type === 'asyncapi'"
            :to="`${prefix}/sheet/${sheet.id}`"
            class="d-tab"
            :class="{
              'd-tab-active': sheetId === sheet.id,
            }"
          >
            {{ sheet.title }}
          </nuxt-link>
        </template>
      </div>
    </div>

    <div class="d-navbar-end">
      <theme-swap class="d-btn d-btn-square d-btn-ghost" :size="6" />

      <button class="d-btn d-btn-square d-btn-ghost" @click="showApiDocumentCreateModal = true">
        <IconPlus class="size-6" />
      </button>

      <button class="d-btn d-btn-square d-btn-ghost" @click="showApplicationSettings = true">
        <IconSettings class="size-6" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
