<script setup lang="ts">
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

const router = useRouter()
const apiDocumentId = computed(() => String(route.params.api_document_id))
watch(
  () => application.value,
  async () => {
    const app = application.value
    if (!app) return

    if (apiDocumentId && app.apiDocuments.some(d => d.id === apiDocumentId.value)) {
      return
    }

    const firstApiDocument = app.apiDocuments[0]
    if (firstApiDocument) {
      await router.replace(`/application/${app.id}/api-document/${firstApiDocument.id}`)
    }
  },
)

</script>

<template>
  <div class="size-full">
    <StuffedLoading :pending="pending">
      <div v-if="application" class="flex flex-col size-full overflow-y-scroll">
        <ApplicationNavbar
          class="sticky z-10 top-0 border-b"
          :application="application"
        />

        <div class="flex-1 py overflow-hidden">
          <NuxtPage />
        </div>
      </div>
    </StuffedLoading>
  </div>
</template>

<style scoped lang="postcss">

</style>
