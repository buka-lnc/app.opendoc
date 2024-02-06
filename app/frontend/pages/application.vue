<script setup lang="ts">
import {
  RiSettingsLine,
} from '@remixicon/vue'
import { queryApplications } from '~/api/backend'
import { Application } from '~/api/backend/components/schemas'

const applications = ref<Application[]>([])
const pagination = reactive({
  total: 0,
  limit: 10,
  offset: 0,
})

const { pending } = useAsyncData(
  async () => {
    const body = await queryApplications({
      limit: pagination.limit,
      offset: pagination.offset,
    })

    applications.value = body.results
    pagination.total = body.page.total
  },
)

</script>

<template>
  <NuxtLoadingIndicator v-if="pending" />

  <div class="container mx-auto flex flex-col">
    <div class="flex-0 py-4 flex items-center justify-between">
      <h1 class="select-none text-5xl font-bold text-gray-600">
        Applications
      </h1>

      <button class="d-btn d-btn-square d-btn-lg d-btn-ghost">
        <RiSettingsLine size="2rem" />
      </button>
    </div>

    <div class="flex-0 flex items-center justify-between">
      <div class="d-join  w-1/2 flex">
        <SelectBox>
          <SelectButton
            class="d-join-item d-select-lg d-select-bordered"
          >
            Title
          </SelectButton>

          <template #options>
            <SelectOption class="d-btn-lg" selected>
              Title
            </SelectOption>
            <SelectOption class="d-btn-lg">
              Tag
            </SelectOption>
          </template>
        </SelectBox>
        <input class="d-join-item flex-auto d-input d-input-bordered d-input-lg" type="text" placeholder="Search">
      </div>

      <button class="d-btn d-btn-lg d-btn-primary">
        Create Application
      </button>
    </div>

    <div class="flex-auto" />
  </div>
</template>

<style scoped lang="postcss">
</style>
