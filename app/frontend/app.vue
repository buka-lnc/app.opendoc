<template>
  <NuxtLayout>
    <Alert />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import './utils/request'

const theme = useTheme()
const ctpClass = computed(() => (theme.value === 'dark' ? 'ctp-macchiato' : 'ctp-latte'))

useHead({
  htmlAttrs: {
    'data-theme': theme,
    class: ctpClass,
  },
})
</script>
