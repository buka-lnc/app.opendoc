<script setup lang="ts">
import { Compiler } from '~/api/backend/components/schemas'

const compiler = defineModel<Compiler | null>('compiler', {
  default: null,
})
</script>

<template>
  <teleport to="body">
    <dialog
      v-if="compiler"
      class="d-modal"
      :class="!!compiler && 'd-modal-open'"
    >
      <div class="d-modal-box font-sans !border-[#5b6078]">
        <h3 class="text-lg font-bold">
          编译器设置
        </h3>

        <div>
          <compiler-option v-for="opt of compiler.options" :key="opt.id" :option="opt" />
        </div>

        <div class="d-modal-action">
          <button class="d-btn" @click="compiler = null">
            关闭
          </button>
        </div>
      </div>
    </dialog>
  </teleport>
</template>

<style scoped lang="postcss">
</style>
