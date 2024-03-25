<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { request } from 'keq'
const config = useRuntimeConfig()

if (config.apiBaseOrigin) {
  request.baseOrigin(config.apiBaseOrigin)
}
</script>
