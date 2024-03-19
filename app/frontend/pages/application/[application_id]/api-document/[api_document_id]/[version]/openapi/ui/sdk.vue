<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { querySdkByVersion } from '~/api/backend'

const applicationId = useRouteParams<string>('application_id')
const apiDocumentId = useRouteParams<string>('api_document_id')
const version = useRouteParams<string>('version')

const { pending, data: sdk } = useAsyncData(
  async () => await querySdkByVersion<200>({
    apiDocumentId: apiDocumentId.value,
    version: version.value,
  }),
)

// const { apiDocument } = inject(API_DOCUMENT_INJECT_KEY, { apiDocument: toRef(null) })
const md = computed(() => {
  if (!sdk.value) return ''
  const fullName = sdk.value.fullName

  return `
# ${fullName}

${sdk.value.isPublished ? '已发布' : '等待构建'}

## Install

\`\`\`bash
npm install ${fullName}@${version.value}
\`\`\`

## Usage

使用SDK发送请求：

\`\`\`typescript
import { operationId } from '${fullName}'

await operationId({
  // options
})
\`\`\`

使用SDK的数据结构（Schema）：

\`\`\`typescript
import type { SchemaName } from '${fullName}/components/schema'

const schema: SchemaName = {
  // data
}
\`\`\`

`
})
</script>

<template>
  <div class="size-full flex items-stretch overflow-y-auto">
    <stuffed-loading :pending="pending" />

    <markdown-view
      class="w-full mx-auto py-6"
      :content="md"
    />
  </div>
</template>

<style scoped lang="postcss"></style>
