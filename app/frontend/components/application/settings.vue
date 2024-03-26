<script setup lang="ts">

// const open = ref(false)
</script>

<template>
  <dialog class="d-modal">
    <div class="d-modal-box size-2/3 max-w-5xl p-0 font-sans">
      <div class="flex-auto flex flex-row size-full">
        <div class="flex-0 bg-base-200 w-40">
          <ul class="d-menu">
            <li>
              <button>应用配置</button>
            </li>

            <li class="d-menu-title">
              文档
            </li>

            <li>
              <button>文档配置</button>
            </li>
          </ul>
        </div>

        <div class="flex-auto flex flex-col space-y-4 p-4">
          <input class="d-input" placeholder="Code">
          <input class="d-input" placeholder="名称">
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped lang="postcss">
</style>
