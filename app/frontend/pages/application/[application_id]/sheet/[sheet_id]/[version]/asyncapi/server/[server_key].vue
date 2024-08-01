<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { ASYNCAPI_DOCUMENT_INJECT_KEY } from '~/constants/asyncapi-document-inject-key.js'

const asyncapiDocument = inject(ASYNCAPI_DOCUMENT_INJECT_KEY)
const serverKey = useRouteParams<string>('server_key')

const server = computed(() => asyncapiDocument?.value.servers[serverKey.value])
</script>

<template>
  <div v-if="server" class="p-10 space-y-10 overflow-y-auto size-full">
    <div>
      <div class="text-2xl space-x-2 flex">
        <clipboard-span :text="server.host" />
      </div>

      <span class="font-sans text-base-content/90">{{ server.description }}</span>
    </div>

    <section-block>
      <div class="flex justify-stretch">
        <section-field class="flex-1">
          <template #label>
            协议/Protocol
          </template>

          <template #default>
            {{ server.protocol }}
          </template>
        </section-field>
      </div>
    </section-block>
  </div>
</template>

<style scoped lang="postcss">
</style>
