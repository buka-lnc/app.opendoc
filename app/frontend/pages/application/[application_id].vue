<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { queryApplication, querySheets } from '~/api/backend'
import { Application, Sheet } from '~/api/backend/components/schemas'
import { APPLICATION_INJECT_KEY } from '~/constants/application-inject-key'

const route = useRoute()
const applicationId = useRouteParams<string>('application_id')

const pending = ref(true)
const application = ref<Application | null>(null)
const sheets = ref<Sheet[]>([])

provide(APPLICATION_INJECT_KEY, { application, sheets })

const { refresh } = useAsyncData(
  async () => {
    const [applicationRes, sheetsRes] = await Promise.all([
      queryApplication<'200'>({
        applicationIdOrCode: applicationId.value,
      }),
      querySheets<'200'>({
        applicationId: applicationId.value,
      }),
    ])

    pending.value = false
    application.value = applicationRes
    sheets.value = sheetsRes.results
  },
  { immediate: true },
)

const router = useRouter()
const sheetId = computed(() => route.params.sheet_id)
watchEffect(async () => {
  if (!application.value || !sheets.value.length) {
    return
  }

  if (sheets.value.some(sheet => sheet.id === sheetId.value)) {
    return
  }

  const firstSheet = sheets.value[0]
  if (firstSheet) {
    await router.replace(`/application/${application.value.id}/sheet/${firstSheet.id}`)
  }
})

</script>

<template>
  <div class="size-full font-mono">
    <StuffedLoading :pending="pending">
      <div v-if="application" class="flex flex-col size-full overflow-y-auto">
        <ApplicationNavbar
          class="sticky z-10 top-0"
          @updated:application="() => refresh()"
          @created:sheet="() => refresh()"
          @deleted:sheet="() => refresh()"
          @updated:sheet="() => refresh()"
        />

        <div class="flex-1 py overflow-hidden bg-base-200">
          <NuxtPage />
        </div>
      </div>
    </StuffedLoading>
  </div>
</template>

<style scoped lang="postcss">

</style>
