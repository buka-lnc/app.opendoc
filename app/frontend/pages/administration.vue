<script setup lang="ts">
import { IconArrowBackUp } from '@tabler/icons-vue'

const router = useRouter()
</script>

<template>
  <div class="size-full flex items-stretch ">
    <div class="h-full overflow-y-auto overflow-x-hidden bg-ctp-mantle">
      <div class="p-2 bg-ctp-crust flex items-center space-x-4">
        <button
          class="d-btn d-btn-square d-btn-ghost"
          @click="router.push('/applications')"
        >
          <IconArrowBackUp class="w-6 h-6" />
        </button>

        <div class="flex items-baseline space-x-1">
          <h1 class="text-xl">
            设置
          </h1>
        </div>
      </div>

      <ul class="flex-0 flex-nowrap d-menu w-72">
        <li>
          <NuxtLink
            to="/administration/console"
            active-class="d-active"
          >
            <span>控制台</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/administration/forbidden-application-code-management"
            active-class="d-active"
          >
            <span>应用编码黑名单</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            to="/administration/plugin-management"
            active-class="d-active"
          >
            <span>插件</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="flex-1 bg-base-100 px-6 py-10">
      <NuxtPage />
    </div>
  </div>

  <!-- <div class="p-10 size-full bg-base-200">
    <administration-forbidden-application-code-management />
  </div> -->
</template>

<style scoped lang="postcss">
</style>
