<template>
  <NuxtLayout>
    <Alert />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import './utils/request'

useHead({
  htmlAttrs: {
    'data-theme': 'dark',
    class: 'dark',
  },
})
</script>
