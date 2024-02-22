<script setup lang="ts">
import { IconSettings, IconArrowBackUp } from '@tabler/icons-vue'
import { queryApplication } from '~/api/backend'

const route = useRoute()
const applicationId = computed(() => String(route.params.id))

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
  <div class="w-full h-full">
    <StuffedLoading :pending="pending">
      <div v-if="application">
        <div class="d-navbar bg-base-100">
          <div class="flex-none">
            <button class="d-btn d-btn-square d-btn-ghost">
              <IconArrowBackUp class="w-6 h-6" />
            </button>
          </div>
          <div class="flex-1 items-baseline">
            <h1 class="text-xl">
              {{ application.title }}
            </h1>
            <span class="text-gray-400">{{ application.code }}</span>
          </div>

          <div class="flex-none">
            <button class="d-btn d-btn-square d-btn-ghost">
              <IconSettings class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="d-join">
          <button class="d-join-item d-btn">
            OpenAPI
          </button>
          <button class="d-join-item d-btn">
            AsyncAPI
          </button>
          <button class="d-join-item d-btn">
            Readme
          </button>
          <button class="d-join-item d-btn">
            Changelog
          </button>
        </div>
      </div>
    </StuffedLoading>
  </div>
</template>

<style scoped lang="postcss">

</style>
