<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { Sdk } from '~/api/backend/components/schemas'

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
      {{ sdk.fullName }}
    </h1>

    <div class="space-x-2 pb-8 font-mono">
      <div class="d-badge d-badge-outline d-badge-success">
        版本 {{ version }}
      </div>

      <sdk-status-badge :status="sdk.status" />
    </div>

    <p>{{ sdk.fullName }} 是从接口文档中自动生成的、具备完善类型提示的 Npm 请求库。</p>

    <h2>
      安装 Package
    </h2>

    <sdk-install-code :sdk="sdk" />

    <h2>
      React Hooks
    </h2>

    <sdk-hook-usage-code :sdk="sdk" />

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
</template>

<style scoped lang="postcss">
</style>
