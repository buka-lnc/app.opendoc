<script setup lang="ts">
import { IconSettings, IconArrowBackUp } from '@tabler/icons-vue'
import { queryApplication } from '~/api/backend'

const route = useRoute()
const applicationId = computed(() => String(route.params.application_id))

const { data: application, pending } = useAsyncData(
  async () => {
    const body = await queryApplication({
      applicationIdOrCode: applicationId.value,
    })

    return body
  },
  {
    default: () => null,
  },
)
</script>

<template>
  <div class="size-full">
    <StuffedLoading :pending="pending">
      <div v-if="application" class="size-full overflow-y-scroll">
        <div class="d-navbar bg-base-100 sticky z-10 top-0">
          <div class="d-navbar-start space-x-2">
            <button
              class="d-btn d-btn-square d-btn-ghost"
              @click="$router.back()"
            >
              <IconArrowBackUp class="w-6 h-6" />
            </button>

            <div class="flex items-baseline space-x-1">
              <h1 class="text-xl">
                {{ application.title }}
              </h1>
              <span class="text-gray-400">{{ application.code }}</span>
            </div>
          </div>

          <div role="tablist" class="d-navbar-center">
            <div class="d-tabs d-tabs-boxed d-tabs">
              <NuxtLink
                v-for="apiDocument of application.apiDocuments"
                :key="apiDocument.id"
                :to="`/application/${$route.params.application_id}/api-document/${apiDocument.id}`"
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

        <div class="flex-1 py-6">
          <NuxtPage />
        </div>
      </div>
    </StuffedLoading>
  </div>
</template>

<style scoped lang="postcss">

</style>
