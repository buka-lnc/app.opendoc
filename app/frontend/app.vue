<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { request } from 'keq'
const config = useRuntimeConfig()

if (process.server) {
  request.baseOrigin(config.apiBaseOrigin)

  request
    .useRouter()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .module('backend', async (ctx, next) => {
      try {
        await next()
      } catch (e) {
        /* eslint-disable-next-line no-console */
        console.log(e)
        throw e
      }
    })
}
</script>
<style lang="postcss">
@tailwind base;

@layer base {
  html {
    -webkit-tap-highlight-color: transparent;
  }

  * {
    /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
    font-family: "pixel" !important;
  }
}
</style>
