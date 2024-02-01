<script setup lang="ts">
import {
RiDeleteBinLine,
RiFolderAddLine,
RiFolderLine,
RiMore2Line,
} from '@remixicon/vue';
import { queryFolders } from '~/api/backend';

const { data: folders, error, isPending } = useAsyncData(async () => {
  const folders = await queryFolders()
  return folders
})

</script>
<template>
  <div class="flex">
    <div class="bg-base-100 w-80 min-h-screen">
      <div class="px-5 py-3 mb-4">
        <a class="btn btn-sm btn-link text-base-content no-underline hover:no-underline px-1 text-3xl">
          OpenDoc
        </a>
        <span class="text-xs">1.0.0</span>
      </div>

      <ul class="text-sm text-base-content px-4 w-full">
        <li v-for="folder in folders" :key="folder.id">
          <div class="w-full inline-flex flex-row justify-between items-center px-3 py-1 hover:bg-base-200 cursor-pointer transition-colors select-none rounded-btn ">
            <span class="flex flex-row items-center">
              <RiFolderLine size="16px" class="mr-1" />
              {{ folder.title }}
            </span>

            <div class="dropdown">
              <div tabindex="0" class="m-1 btn btn-xs bg-transparent shadow-none border-0">
                <RiMore2Line size="18px" />
              </div>

              <ul tabindex="0" class="z-[1] shadow p2 menu menu-sm dropdown-content bg-base-100 rounded-box w-28">
                <li>
                  <a class="btn btn-ghost btn-squash btn-sm">
                    <RiFolderAddLine size="18px" />
                    新建
                  </a>
                </li>
                <li>
                  <a class="btn btn-ghost btn-squash btn-sm">
                    <RiDeleteBinLine size="18px" />
                    删除
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div>
      <!--  -->
    </div>
  </div>
</template>
<style scoped lang="postcss">
</style>
