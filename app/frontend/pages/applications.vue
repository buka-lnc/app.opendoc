<script setup lang="ts">
import { IconSettings } from '@tabler/icons-vue'
import { queryApplications } from '~/api/backend'
import { ApplicationDTO } from '~/api/backend/components/schemas'

definePageMeta({
  alias: '/',
})

const applications = ref<ApplicationDTO[]>([])
const pagination = reactive({
  total: 0,
  limit: 10,
  offset: 0,
})

const filterType = ref<'title' | 'code'>('title')
const search = ref('')

const { status, refresh } = useAsyncData(
  async () => {
    const body = await queryApplications<'200'>({
      limit: String(pagination.limit),
      offset: String(pagination.offset),
      title: filterType.value === 'title' ? search.value.trim() : undefined,
      code: filterType.value === 'code' ? search.value.trim() : undefined,
    })

    applications.value = body.results
    pagination.total = body.pagination.total
  },
  {
    immediate: true,
    watch: [search],
  },
)

const showCreateModal = ref(false)

const filterTypeDescription = {
  title: '名称',
  code: '编码',
}
</script>

<template>
  <ApplicationCreateModal
    v-model:show="showCreateModal"
    @created:application="() => refresh()"
  />

  <div class="flex flex-col font-mono relative overflow-y-auto size-full bg-ctp-base">
    <div class="z-10 sticky top-0 m-0 flex-0 pb-4">
      <div class="d-navbar bg-ctp-crust">
        <div class="flex-1">
          <a
            class="d-btn d-btn-ghost text-xl"
            href="https://github.com/buka-lnc/app.opendoc"
            target="_blank"
          >OpenDoc</a>
        </div>

        <div class="flex-none">
          <theme-swap class="d-btn d-btn-square d-btn-ghost" :size="8" />

          <NuxtLink
            class="d-btn d-btn-square d-btn-ghost"
            to="/administration/forbidden-application-code-management"
          >
            <IconSettings class="size-8" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="pt-2 container m-auto flex items-center justify-between">
      <div class="d-join  w-1/2 flex">
        <SelectBox v-model="filterType" class="w-32">
          <SelectButton
            class="d-join-item d-select-bordered"
          >
            {{ filterTypeDescription[filterType] }}
          </SelectButton>

          <template #options>
            <SelectOption value="title" class="!w-32">
              {{ filterTypeDescription.title }}
            </SelectOption>
            <SelectOption value="code" class="!w-32">
              {{ filterTypeDescription.code }}
            </SelectOption>
          </template>
        </SelectBox>

        <input
          v-model="search"
          class="d-join-item flex-auto d-input d-input-bordered"
          type="text"
          placeholder="搜索"
        >
      </div>

      <button
        class="d-btn d-btn-primary"
        @click="showCreateModal = true"
      >
        新建应用
      </button>
    </div>

    <StuffedLoading :pending="status === 'pending' && !applications.length">
      <div class="container m-auto flex-auto pt-4 space-y-4">
        <div v-for="application in applications" :key="application.id">
          <application-preview-card :application="application" />
        </div>
      </div>
    </StuffedLoading>
  </div>
</template>

<style scoped lang="postcss">
</style>
