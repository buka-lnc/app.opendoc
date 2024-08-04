<template>
  <NuxtLayout>
    <Alert />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import './utils/request'

const theme = useTheme()

useHead({
  htmlAttrs: {
    'data-theme': theme,
    class: 'dark',
  },
})
</script>
