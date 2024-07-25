<script setup lang="ts">

</script>

<template>
  <div class="size-full flex items-stretch ">
    <div class="h-full overflow-y-auto overflow-x-hidden">
      <ul class="flex-0 flex-nowrap d-menu bg-base-200 h-full w-72">
        <li>
          <NuxtLink
            class="rounded-none"
            to="/administration/forbidden-application-code-management"
            active-class="d-active"
          >
            <span>应用编码黑名单</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink
            class="rounded-none"
            to="/administration/compiler-management"
            active-class="d-active"
          >
            <span>编译器</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="flex-1 bg-base-300 px-6 py-10">
      <NuxtPage />
    </div>
  </div>

  <!-- <div class="p-10 size-full bg-base-200">
    <administration-forbidden-application-code-management />
  </div> -->
</template>

<style scoped lang="postcss">
</style>
