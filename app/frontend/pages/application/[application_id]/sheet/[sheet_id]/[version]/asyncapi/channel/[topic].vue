<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { ASYNCAPI_DOCUMENT_INJECT_KEY } from '~/constants/asyncapi-document-inject-key'

const asyncapiDocument = inject(ASYNCAPI_DOCUMENT_INJECT_KEY)

const topic = useRouteParams<string>('topic')
const channel = computed(() => asyncapiDocument?.value.channels[topic.value])

const toReference = useAsyncapiToReference()
</script>

<template>
  <div class="p-10 space-y-10 overflow-y-auto size-full">
    <div>
      <div class="text-2xl space-x-2 flex">
        <clipboard-span :text="topic" />
      </div>
      <span class="font-sans text-base-content/90">{{ channel.address }}</span>
    </div>

    <section-block
      v-for="(message, messageId) of channel.messages"
      :key="messageId"
    >
      <template #title>
        <span v-if="message.name">{{ message.name }}</span>
        <span v-else>{{ messageId }}</span>
      </template>

      <template v-if="message.name" #description>
        {{ messageId }}
      </template>

      <FlexibleDiv
        role="tabpanel"
        class="d-tab-content block bg-base-200/30 border-base-300 rounded-box"
      >
        <div class="p-6">
          <json-schema
            v-if="message?.payload"
            :schema="message?.payload"
            :to-reference="toReference"
          />
        </div>
      </FlexibleDiv>
    </section-block>
  </div>
</template>

<style scoped lang="postcss">
</style>
