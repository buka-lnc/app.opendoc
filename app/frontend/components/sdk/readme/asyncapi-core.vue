<script setup lang="ts">
import { IconSchema } from '@tabler/icons-vue'
import { useRouteParams } from '@vueuse/router'
import { Sdk } from '~/api/backend/components/schemas'

const route = useRoute()
const version = useRouteParams<string>('version')

const props = defineProps<{
  sdk: Sdk
}>()

const sdk = toRef(props, 'sdk')

</script>

<template>
  <div
    :class="[
      'py-8 h-fit overflow-hidden',
      'prose prose-invert lg:prose-xl',
      'prose-pre:shadow-none prose-pre:!bg-transparent prose-pre:p-0 prose-pre:m-0',
    ]"
  >
    <h1 class="text-3xl py-4 !mb-2">
      {{ sdk.name }}
    </h1>

    <div class="space-x-2 pb-8 font-mono">
      <div class="d-badge d-badge-outline d-badge-success">
        版本 {{ version }}
      </div>

      <sdk-status-badge :status="sdk.status" />
    </div>

    <p>{{ sdk.name }} 是从 Asyncapi 文档自动生成的 Typescript Interface 库。</p>

    <h2>
      安装 Package
    </h2>

    <sdk-install-code :sdk="sdk" />

    <h2>
      数据结构与类型定义
    </h2>

    <p>
      请在实际使用中将示例代码中的
      <code>SchemaName</code>
      替换为

      <nuxt-link
        :to="`/application/${route.params.application_id}/api-document/${route.params.api_document_id}/${route.params.version}/openapi/operation`"
      >
        <icon-schema class="inline-block w-8 h-8" />
      </nuxt-link>
      页面展示的数据结构名。
    </p>

    <sdk-schema-usage-code :sdk="sdk" />
  </div>
</template>

<style scoped lang="postcss">
</style>
