<script setup lang="ts">
import { ApplicationDTO } from '~/api/backend/components/schemas'

const props = defineProps<{
  application: ApplicationDTO
}>()
</script>

<template>
  <NuxtLink
    class="group d-card bg-ctp-mantle transition-[background] hover:bg-ctp-mantle/70 cursor-pointer border-b last:border-none border-neutral"
    :to="`/application/${props.application.id}`"
  >
    <div class="d-card-body">
      <div class="d-card-title group-hover:font-bold">
        {{ props.application.title }}
      </div>

      <p>{{ props.application.code }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped lang="postcss">
</style>
