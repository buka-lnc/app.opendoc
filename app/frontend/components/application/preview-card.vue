<script setup lang="ts">
import { ApplicationDTO } from '~/api/backend/components/schemas'

const props = defineProps<{
  application: ApplicationDTO
}>()
</script>

<template>
  <NuxtLink
    class="d-card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    :to="`/application/${props.application.id}`"
  >
    <div class="d-card-body">
      <div class="d-card-title">
        {{ props.application.title }}
      </div>

      <p>{{ props.application.code }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped lang="postcss">
</style>
