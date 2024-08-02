<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { querySdks } from '~/api/backend/query_sdks.js'

const applicationId = useRouteParams<string>('application_id')
const sheetId = useRouteParams<string>('sheet_id')
const version = useRouteParams<string>('version')
const prefix = computed(() => `/application/${applicationId.value}/sheet/${sheetId.value}/${version.value}/openapi/sdk`)

const { pending, data: sdks } = useAsyncData(
  async () => {
    const body = await querySdks<'200'>({
      sheetId: sheetId.value,
      version: version.value,
    })
    return body.results
  },
  {
    default: () => ([]),
  },
)

const route = useRoute()
const router = useRouter()
watch(
  () => toValue(sdks),
  async () => {
    if (route.path === prefix.value && sdks.value && sdks.value.length > 0) {
      await router.replace(`${prefix.value}/${sdks.value[0].id}`)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="size-full flex items-stretch ">
    <stuffed-loading :pending="pending" />

    <div class="h-full overflow-y-auto overflow-x-hidden">
      <ul class="flex-0 flex-nowrap d-menu d-menu-sm h-full w-72">
        <li v-for="sdk in sdks" :key="sdk.id">
          <NuxtLink
            class="w-full inline-flex justify-between"
            :to="`${prefix}/${sdk.id}`"
            active-class="d-active"
          >
            <span class="truncate">{{ sdk.name }}@{{ sdk.version.version }}</span>

            <span v-if="sdk.status === 'pending'" class="text-warning font-sans">待构建</span>
            <span v-else-if="sdk.status === 'compiling'" class="text-warning font-sans">构建中</span>
            <span v-else-if="sdk.status === 'published'" class="text-success font-sans">已发布</span>
            <span v-else class="text-error font-sans">缺失</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="flex-1 bg-base-100">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
