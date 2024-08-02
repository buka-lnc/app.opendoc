<script setup lang="ts">
import { ApiFileCategory } from '~/types/api-file-category'

defineProps<{
  categories: ApiFileCategory[]
  to:(category: ApiFileCategory) => string
}>()

</script>

<template>
  <ul class="d-menu">
    <li v-for="category of categories" :key="category.$path">
      <NuxtLink
        v-if="category.$children.length === 0"
        class="d-menu-link font-sans"
        :to="to(category)"
        active-class="d-active"
      >
        {{ category.$name }}
      </NuxtLink>

      <h2
        v-else
        class="d-menu-title"
      >
        {{ category.$name }}
      </h2>

      <api-file-categories
        v-if="category.$children.length"
        :categories="category.$children"
        :to="to"
      />
    </li>
  </ul>
</template>

<style scoped lang="postcss">
</style>
