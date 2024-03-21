<script setup lang="ts">
import { IconApi, IconSchema } from '@tabler/icons-vue'
import { useRouteParams } from '@vueuse/router'
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
</script>

<template>
  <div class="size-full flex items-stretch overflow-y-auto">
    <stuffed-loading :pending="pending" />

    <div
      v-if="sdk"
      :class="[
        'container mx-auto py-8 h-fit overflow-hidden',
        'prose prose-invert lg:prose-xl',
        'prose-pre:shadow-none prose-pre:!bg-transparent prose-pre:p-0 prose-pre:m-0',
      ]"
    >
      <h1 class="text-3xl py-4 !mb-2">
        {{ sdk.fullName }}
      </h1>

      <div class="space-x-2 pb-8">
        <div class="d-badge d-badge-outline d-badge-success">
          版本 {{ version }}
        </div>

        <div v-if="sdk.isPublished" class="d-badge d-badge-outline d-badge-success">
          已发布
        </div>

        <div v-else class="d-badge d-badge-outline d-badge-warning">
          待构建
        </div>
      </div>

      <p>{{ sdk.fullName }} 是从接口文档中自动生成的、具备完善类型提示的 Npm 请求库。</p>

      <h2>
        安装 Package
      </h2>

      <sdk-install-code :sdk="sdk" />

      <h2>
        发送接口请求
      </h2>

      <p>
        请在实际使用中将示例代码中的
        <code>operationId</code>
        替换为

        <nuxt-link
          :to="`/application/${$route.params.application_id}/api-document/${$route.params.api_document_id}/${$route.params.version}/openapi/ui/operation`"
        >
          <icon-api class="inline-block w-8 h-8" />
        </nuxt-link>
        页面展示的 <code>OperationId</code>。
      </p>

      <sdk-operation-usage-code :sdk="sdk" />

      <h2>
        数据结构与类型定义
      </h2>

      <p>
        请在实际使用中将示例代码中的
        <code>SchemaName</code>
        替换为

        <nuxt-link
          :to="`/application/${$route.params.application_id}/api-document/${$route.params.api_document_id}/${$route.params.version}/openapi/ui/operation`"
        >
          <icon-schema class="inline-block w-8 h-8" />
        </nuxt-link>
        页面展示的数据结构名。
      </p>

      <sdk-schema-usage-code :sdk="sdk" />

      <h2>
        React Hooks
      </h2>

      <sdk-hook-usage-code :sdk="sdk" />

      <h2>
        高阶应用
      </h2>

      <p>
        得益于使用
        <a href="https://github.com/keq-request/keq">Keq</a>
        作为底层请求库。
        SDK 可以利用 Keq 设计的中间件模型和链式调用的特性，
        在不需要修改 SDK 自动生成的代码的情况下，实现一些高阶应用。
      </p>

      <h3>
        Example 1: 添加统一的错误处理逻辑
      </h3>

      <p>让我们设定当请求的状态码 <code>&gt;400</code>时，抛出一个错误。</p>

      <sdk-error-handle-code :sdk="sdk" />

      <p>当我们调用 SDK 封装的函数发送Http请求，若状态码<code>&gt;400</code>，就可以catch到异常。</p>

      <sdk-catch-error-code :sdk="sdk" />

      <h3>
        Example 2: 添加未定义的接口参数或调整请求行为
      </h3>

      <p>
        得益于
        <a href="https://github.com/keq-request/keq">Keq</a>
        的链式调用特性，我们可以非常优雅的添加/修改请求参数，或是调整默认的请求行为。
      </p>
      <sdk-inject-args-code :sdk="sdk" />

      <p>
        React 的 Hooks 会受
        <a href="https://github.com/keq-request/keq">Keq</a>
        的中间件控制。但是 Hooks 无法通过链式调用的方式调整请求行为。
        如果 SDK 默认的Hooks无法满足需求，
        请考虑配合使用
        <a href="https://github.com/streamich/react-use/blob/master/docs/useAsync.md">react-use 的 useAsync</a>
        和 <code>${sdk.fullName}/operations</code>。不过我保证你会很少遇到这种情况。
      </p>

      <p>
        <a href="https://github.com/keq-request/keq">Keq</a>
        还有许多的特性和中间件，更多的使用方法请查看
        <a href="https://github.com/keq-request/keq/blob/master/README.md">Keq 的文档</a>
        。
      </p>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
