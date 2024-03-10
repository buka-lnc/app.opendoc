<script setup lang="ts">
import { OPENDOC_SERVERS_INJECT_KEY } from '~/constants/opendoc-servers-inject-key.js'

const { servers } = inject(OPENDOC_SERVERS_INJECT_KEY, { servers: toRef([]) })
console.log('🚀 ~ servers:', servers.value)

const route = useRoute()
const serverIndex = computed(() => Number(route.params.server_index))
const server = computed(() => servers.value[serverIndex.value])

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

    <div>
      <openapi-subtitle>
        Variables
      </openapi-subtitle>
    </div>
  </div>
</template>

<style scoped lang="postcss">
</style>
