<script setup lang="ts">
import { IconCircleCheck } from '@tabler/icons-vue'

const { messages } = useAlertState()
</script>

<template>
  <teleport to="body">
    <div class="z-[1000] absolute bottom-8 right-6 flex flex-col items-end space-y-2">
      <transition-group
        enter-active-class="transition-all duration-75 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition-all duration-75 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-00"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          role="alert"
          class="d-alert w-fit"
          :class="{
            'd-alert-success': message.type === 'success',
            'bg-red-500': message.type === 'error',
          }"
        >
          <IconCircleCheck class="size-5 text-green-950 stroke-2" />
          <span class="text-green-950">
            {{ message.message }}
          </span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style scoped lang="postcss">
</style>
