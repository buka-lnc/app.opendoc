<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { codeToHtml } from 'shiki'
import { querySdkByVersion } from '~/api/backend'

// const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')

const { pending, data: sdk } = useAsyncData(
  async () => await querySdkByVersion<200>({
    apiDocumentId: apiDocumentId.value,
    version: version.value,
  }),
)

const { data: installCode } = useAsyncData(
  async () => {
    if (!sdk.value) return ''
    const fullName = sdk.value.fullName

    return await codeToHtml(`
echo "@${sdk.value.scope}:registry=${window.location.origin}/api/registry" > .npmrc
npm install ${fullName}@${version.value}
  `, {
      lang: 'bash',
      theme: 'nord',
    })
  },
  {
    default: () => '',
    watch: [sdk, version],
  },
)

const { data: usageCode } = useAsyncData(
  async () => {
    if (!sdk.value) return ''
    const fullName = sdk.value.fullName

    return await codeToHtml(`
import { operationId } from '${fullName}/operations'

await operationId({
  // options
})
  `, {
      lang: 'typescript',
      theme: 'nord',
    })
  },
  {
    default: () => '',
    watch: [sdk, version],
  },
)

const { data: schemaCode } = useAsyncData(
  async () => {
    if (!sdk.value) return ''
    const fullName = sdk.value.fullName

    return await codeToHtml(`
import type { SchemaName } from '${fullName}/schemas'

const schema: SchemaName = {
  // data
}
  `, {
      lang: 'typescript',
      theme: 'nord',
    })
  },
  {
    default: () => '',
    watch: [sdk, version],
  },
)

const { data: hookCode } = useAsyncData(
  async () => {
    if (!sdk.value) return ''
    const fullName = sdk.value.fullName

    return await codeToHtml(`
import { useOperationId } from '${fullName}/hooks'

export function Component(props) {
  const { data, error, loading } = useOperationId(
    {
      //options
    },
    // [deps],
  )

  if (loading) return <Loading />
  if (error) return <Error />
  if (!data) return <div>No data</div>

  return <div>{JSON.stringify(data)}</div>
}
  `, {
      lang: 'jsx',
      theme: 'nord',
    })
  },
  {
    default: () => '',
    watch: [sdk, version],
  },
)
</script>

<template>
  <div class="size-full flex items-stretch overflow-y-auto">
    <stuffed-loading :pending="pending" />

    <div
      v-if="sdk"
      :class="[
        'container mx-auto',
        'prose prose-invert lg:prose-xl',
        'prose-pre:shadow-none prose-pre:!bg-transparent prose-pre:p-0 prose-pre:m-0',
      ]"
    >
      <h1 class="text-3xl py-4">
        {{ sdk.fullName }}
      </h1>

      <h2>
        安装 Package
      </h2>
      <div class="d-mockup-code [&_code]:inline-block" v-html="installCode" />

      <h2>
        发送接口请求
      </h2>

      <div class="d-mockup-code [&_code]:inline-block" v-html="usageCode" />

      <h2>
        数据结构与类型定义
      </h2>

      <div class="d-mockup-code [&_code]:inline-block" v-html="schemaCode" />

      <h2>
        React Hooks
      </h2>

      <div class="d-mockup-code [&_code]:inline-block" v-html="hookCode" />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
