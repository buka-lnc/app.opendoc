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

const { pending, refresh } = useAsyncData(
  async () => {
    console.log('123123')
    const x = queryApplications<'200'>({
      limit: pagination.limit,
      offset: pagination.offset,
      title: filterType.value === 'title' ? search.value.trim() : undefined,
      code: filterType.value === 'code' ? search.value.trim() : undefined,
    })
    console.log('xxx', x.end())

    const body = await x.end()
    console.log('body')

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
  title: 'Title',
  code: 'Code',
}
</script>

<template>
  <ApplicationCreateModal
    v-model:show="showCreateModal"
    @created:application="() => refresh()"
  />

  <StuffedLoading :pending="pending">
    <div class="flex flex-col font-mono relative overflow-y-auto size-full">
      <div class="z-10 bg-base-100 sticky top-0 container m-auto flex-0 pb-4">
        <div class="flex items-center justify-between py-4">
          <h1 class="select-none text-5xl font-bold text-gray-600">
            Applications
          </h1>

          <NuxtLink
            class="d-btn d-btn-square d-btn-lg d-btn-ghost"
            to="/administration"
          >
            <IconSettings class="w-8 h-8" />
          </NuxtLink>
        </div>

        <div class="flex items-center justify-between">
          <div class="d-join  w-1/2 flex">
            <SelectBox v-model="filterType" class="w-32">
              <SelectButton
                class="d-join-item d-select-lg d-select-bordered"
              >
                {{ filterTypeDescription[filterType] }}
              </SelectButton>

              <template #options>
                <SelectOption class="d-btn-lg" value="title">
                  {{ filterTypeDescription.title }}
                </SelectOption>
                <SelectOption class="d-btn-lg" value="code">
                  {{ filterTypeDescription.code }}
                </SelectOption>
              </template>
            </SelectBox>
            <input
              v-model="search"
              class="d-join-item flex-auto d-input d-input-bordered d-input-lg"
              type="text"
              placeholder="Search"
            >
          </div>

          <button
            class="d-btn d-btn-lg d-btn-primary"
            @click="showCreateModal = true"
          >
            Create Application
          </button>
        </div>
      </div>

      <div class="container m-auto flex-auto pt-6 space-y-4">
        <div v-for="application in applications" :key="application.id">
          <application-preview-card :application="application" />
        </div>
      </div>
    </div>
  </StuffedLoading>
</template>

<style scoped lang="postcss">
</style>
