<script setup lang="ts">
import { OPENAPI_DOCUMENT_INJECT_KEY } from '~/constants/openapi-document-inject-key.js'

const openapi = inject(OPENAPI_DOCUMENT_INJECT_KEY)

const route = useRoute()
const serverIndex = computed(() => Number(route.params.server_index))
const server = computed(() => openapi?.value.servers?.[serverIndex.value])
</script>

<template>
  <div v-if="server" class="size-full bg-base-300 p-10 space-y-10">
    <div>
      <h1 class="text-2xl">
        <clipboard-span :text="server.url" />
      </h1>

      <p v-if="server.description" class="font-sans text-base-content/80">
        {{ server.description }}
      </p>
    </div>

    <section-block>
      <template #title>
        <section-title>
          Variables
        </section-title>
      </template>
    </section-block>
  </div>
</template>

<style scoped lang="postcss">
</style>
